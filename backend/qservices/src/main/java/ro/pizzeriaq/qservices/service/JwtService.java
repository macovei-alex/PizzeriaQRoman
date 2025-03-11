package ro.pizzeriaq.qservices.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class JwtService {

	public static final Duration DEFAULT_ACCESS_EXPIRATION_DELAY = Duration.ofMinutes(15);
	public static final Duration DEFAULT_REFRESH_EXPIRATION_DELAY = Duration.ofDays(30);


	private final KeyPair keyPair;


	public String generateToken(String subject, Duration expirationDelay) throws Exception {
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


	public JWTClaimsSet parseToken(String token) throws ParseException, JOSEException {
		SignedJWT signedJWT = SignedJWT.parse(token);
		RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
		JWSVerifier verifier = new RSASSAVerifier(publicKey);

		if (!signedJWT.verify(verifier)) {
			throw new JOSEException("Token signature is invalid");
		}

		return signedJWT.getJWTClaimsSet();
	}
}
