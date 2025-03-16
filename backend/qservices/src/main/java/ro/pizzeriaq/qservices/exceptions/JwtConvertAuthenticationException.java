package ro.pizzeriaq.qservices.exceptions;

import lombok.Getter;

@Getter
public class JwtConvertAuthenticationException extends Exception {

	private final int status;


	public JwtConvertAuthenticationException(int status, String message) {
		super(message);
		this.status = status;
	}
}
