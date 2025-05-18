package ro.pizzeriaq.qservices.exceptions;

public class TypesenseException extends RuntimeException {

	public TypesenseException(String message) {
		super(message);
	}

	public TypesenseException(String message, Throwable cause) {
		super(message, cause);
	}

}
