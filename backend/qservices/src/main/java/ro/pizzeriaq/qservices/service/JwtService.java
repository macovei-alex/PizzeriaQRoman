package ro.pizzeriaq.qservices.service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.util.Date;
import java.util.UUID;

@Service
@AllArgsConstructor
public class JwtService {

	private final KeyPair keyPair;


	public String generateToken(String username, long expirationMillis) throws Exception {
		RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

		JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
				.subject(username)
				.issuer("pizzeriaq")
				.expirationTime(new Date(System.currentTimeMillis() + expirationMillis))
				.jwtID(UUID.randomUUID().toString())
				.claim("roles", "ROLE_USER")
				.build();

		SignedJWT signedJWT = new SignedJWT(
				new JWSHeader.Builder(JWSAlgorithm.RS256).keyID(UUID.randomUUID().toString()).build(),
				claimsSet
		);

		signedJWT.sign(new RSASSASigner(privateKey));

		return signedJWT.serialize();
	}
}
