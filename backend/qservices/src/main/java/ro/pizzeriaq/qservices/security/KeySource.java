package ro.pizzeriaq.qservices.security;

import java.security.KeyPair;

public interface KeySource {

	KeyPair getKeyPair() throws Exception;

}
