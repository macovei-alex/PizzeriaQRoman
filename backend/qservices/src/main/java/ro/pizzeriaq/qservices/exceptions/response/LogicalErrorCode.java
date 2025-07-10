package ro.pizzeriaq.qservices.exceptions.response;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum LogicalErrorCode {
	PHONE_NUMBER_MISSING,
	PRICE_MISMATCH,
	KEYCLOAK_ERROR,
}
