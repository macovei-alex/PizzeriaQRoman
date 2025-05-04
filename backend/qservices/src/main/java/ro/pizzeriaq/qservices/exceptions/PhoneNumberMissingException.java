package ro.pizzeriaq.qservices.exceptions;

import lombok.Getter;

import java.util.UUID;

@Getter
public class PhoneNumberMissingException extends RuntimeException {

	private final UUID accountId;


	public PhoneNumberMissingException(UUID accountId) {
		super("Phone number is missing for account with id: %s".formatted(accountId));
		this.accountId = accountId;
	}


	public PhoneNumberMissingException(String message, UUID accountId) {
		super(message);
		this.accountId = accountId;
	}


	public PhoneNumberMissingException(String message, Throwable cause, UUID accountId) {
		super(message, cause);
		this.accountId = accountId;
	}


	public PhoneNumberMissingException(Throwable cause, UUID accountId) {
		super(cause);
		this.accountId = accountId;
	}

}
