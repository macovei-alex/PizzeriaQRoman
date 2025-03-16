package ro.pizzeriaq.qservices.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.util.Pair;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.exceptions.JwtConvertAuthenticationException;
import ro.pizzeriaq.qservices.security.JwtAuthentication;
import ro.pizzeriaq.qservices.security.KeySource;
import ro.pizzeriaq.qservices.service.DTO.GeneratedJwtPairDTO;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {
	private static final Logger logger = LoggerFactory.getLogger(JwtService.class);


	@Value("${app.jwt.access-token.expiration-delay}")
	private Duration accessExpirationDelay;

	@Value("${app.jwt.refresh-token.expiration-delay}")
	private Duration refreshExpirationDelay;

	private final KeySource keySource;


	public JwtService(KeySource keySource) {
		this.keySource = keySource;
	}


	public GeneratedJwtPairDTO generateTokenPair(String subject) throws JOSEException {
		return generateTokenPair(subject, accessExpirationDelay, refreshExpirationDelay);
	}


	public GeneratedJwtPairDTO generateTokenPair(
			String subject,
			Duration accessExpirationDelay,
			Duration refreshExpirationDelay
	) throws JOSEException {
		return GeneratedJwtPairDTO.builder()
				.accessToken(generateToken(subject, accessExpirationDelay))
				.refreshToken(generateToken(subject, refreshExpirationDelay))
				.build();
	}


	private String generateToken(String subject, Duration expirationDelay) throws JOSEException {
		KeyPair keyPair = getKeyPair();

		RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

		JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
				.issuer("pizzeriaq")
				.subject(subject)
				.expirationTime(new Date(System.currentTimeMillis() + expirationDelay.toMillis()))
				.jwtID(UUID.randomUUID().toString())
				.claim("roles", List.of("ROLE_USER"))
				.build();

		SignedJWT signedJWT = new SignedJWT(
				new JWSHeader.Builder(JWSAlgorithm.RS256)
						.keyID(UUID.randomUUID().toString()).build(),
				claimsSet
		);

		signedJWT.sign(new RSASSASigner(privateKey));

		return signedJWT.serialize();
	}


	private KeyPair getKeyPair() throws JOSEException {
		KeyPair keyPair;
		try {
			keyPair = keySource.getKeyPair();
		} catch (Exception e) {
			logger.error("Failed to get token generation key pair", e);
			throw new JOSEException("Failed to get key pair");
		}
		return keyPair;
	}


	public JwtAuthentication convertToken(String token) throws JwtConvertAuthenticationException {
		JWTClaimsSet claims;

		try {
			claims = extractClaims(token);
		} catch (ParseException | JOSEException e) {
			logger.error("Failed to parse JWT token. This error should never happen", e);
			throw new JwtConvertAuthenticationException(
					HttpServletResponse.SC_BAD_REQUEST,
					"Something went wrong when parsing the JWT"
			);
		}

		var validationResult = validate(claims);

		if (validationResult.getLeft() != HttpServletResponse.SC_OK) {
			logger.error("JWT token validation failed: {}", validationResult.getRight());
			throw new JwtConvertAuthenticationException(
					validationResult.getLeft(),
					validationResult.getRight()
			);
		}

		List<? extends GrantedAuthority> roles;

		try {
			roles = claims.getListClaim("roles").stream()
					.map(Object::toString)
					.filter(authority -> authority.startsWith("ROLE_"))
					.map(SimpleGrantedAuthority::new)
					.toList();
		} catch (ParseException e) {
			logger.error("Failed to parse roles claim from JWT token even after the validation passed", e);
			throw new JwtConvertAuthenticationException(
					HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Something went wrong when parsing the JWT"
			);
		}

		return JwtAuthentication.builder()
				.isAuthenticated(true)
				.issuer(claims.getIssuer())
				.subject(claims.getSubject())
				.expiresAt(claims.getExpirationTime())
				.authorities(roles)
				.build();
	}


	public JWTClaimsSet extractClaims(String token) throws ParseException, JOSEException {
		KeyPair keyPair = getKeyPair();

		if (token == null) {
			throw new IllegalArgumentException("Token is null");
		}

		SignedJWT signedJWT = SignedJWT.parse(token);
		RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
		JWSVerifier verifier = new RSASSAVerifier(publicKey);

		if (!signedJWT.verify(verifier)) {
			throw new JOSEException("Token signature is invalid");
		}

		return signedJWT.getJWTClaimsSet();
	}


	private Pair<Integer, String> validate(JWTClaimsSet claims) {
		if (claims.getSubject() == null || claims.getSubject().isEmpty()) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no subject");
		}

		if (claims.getIssuer() == null || claims.getIssuer().isEmpty()) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no issuer");
		}

		if (claims.getExpirationTime() == null) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no expiration time");
		}

		if (claims.getExpirationTime().before(new Date())) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has expired");
		}

		try {
			if (claims.getListClaim("roles") == null) {
				return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no roles");
			}
		} catch (ParseException e) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has invalid roles");
		}

		return Pair.of(HttpServletResponse.SC_OK, null);
	}
}
