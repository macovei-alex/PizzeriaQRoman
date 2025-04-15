package ro.pizzeriaq.qservices.security.old;

import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

// @Service
public class DevFilesKeySource implements KeySource {

	private static final String PRIVATE_KEY_PATH = "src/main/resources/static/dev/private.pem";
	private static final String PUBLIC_KEY_PATH = "src/main/resources/static/dev/public.pem";


	private KeyPair keyPair;


	@Override
	public KeyPair getKeyPair() throws Exception {
		if (keyPair == null) {
			PrivateKey privateKey = loadPrivateKey(PRIVATE_KEY_PATH);
			PublicKey publicKey = loadPublicKey(PUBLIC_KEY_PATH);
			keyPair = new KeyPair(publicKey, privateKey);
		}
		return keyPair;
	}


	private PrivateKey loadPrivateKey(String filepath) throws Exception {
		String key = new String(Files.readAllBytes(Paths.get(filepath)))
				.replace("-----BEGIN PRIVATE KEY-----", "")
				.replace("-----END PRIVATE KEY-----", "")
				.replaceAll("\\s", "");

		byte[] keyBytes = Base64.getDecoder().decode(key);
		PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		return keyFactory.generatePrivate(spec);
	}


	private PublicKey loadPublicKey(String filepath) throws Exception {
		String key = new String(Files.readAllBytes(Paths.get(filepath)))
				.replace("-----BEGIN PUBLIC KEY-----", "")
				.replace("-----END PUBLIC KEY-----", "")
				.replaceAll("\\s", "");

		byte[] keyBytes = Base64.getDecoder().decode(key);
		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		return keyFactory.generatePublic(spec);
	}
}
