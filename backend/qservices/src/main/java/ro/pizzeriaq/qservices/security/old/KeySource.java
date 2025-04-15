package ro.pizzeriaq.qservices.security.old;

import java.security.KeyPair;

public interface KeySource {

	KeyPair getKeyPair() throws Exception;

}
