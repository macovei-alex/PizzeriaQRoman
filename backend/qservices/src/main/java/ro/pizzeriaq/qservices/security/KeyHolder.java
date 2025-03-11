package ro.pizzeriaq.qservices.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

@Configuration
public class KeyHolder {

	@Bean
	public KeyPair keyPair() throws Exception {
		KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance("RSA");
		keyGenerator.initialize(2048);
		return keyGenerator.generateKeyPair();
	}

}
