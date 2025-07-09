package ro.pizzeriaq.qservices.exceptions.handler;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import ro.pizzeriaq.qservices.exceptions.*;

import javax.naming.ServiceUnavailableException;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleGeneralException(Exception e) {
		log.error("Unexpected error", e);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("An unexpected error occurred: " + e.getMessage());
	}


	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
		log.error("Illegal argument exception", e);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}


	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleInvalidData(MethodArgumentNotValidException e) {
		Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField, (field) -> messageOrDefault(field.getDefaultMessage())));

		log.error("Invalid data received", e);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
	}


	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<String> handleInvalidData(MethodArgumentTypeMismatchException e) {
		log.error("Invalid data received", e);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}


	@ExceptionHandler(KeycloakException.class)
	public ResponseEntity<String> handleKeycloakException(KeycloakException e) {
		log.error("Keycloak error", e);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
	}


	@ExceptionHandler(TypesenseException.class)
	public ResponseEntity<String> handleTypesenseException(TypesenseException e) {
		log.error("Typesense error", e);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
	}


	@ExceptionHandler(ServiceUnavailableException.class)
	public ResponseEntity<String> handleServiceUnavailableException(ServiceUnavailableException e) {
		log.error("Service unavailable", e);
		return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
	}


	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<String> handleNoResourceFoundException(NoResourceFoundException e) {
		log.error("Resource not found", e);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	}


	@ExceptionHandler(PhoneNumberMissingException.class)
	public ResponseEntity<String> handlePhoneNumberMissingException(PhoneNumberMissingException e) {
		log.error("Phone number missing", e);
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(e.getMessage());
	}


	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException e) {
		log.error("Entity not found", e);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	}


	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e) {
		log.error("Access denied", e);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
	}


	@ExceptionHandler(PriceNotMatchingException.class)
	public ResponseEntity<String> handlePriceDoesNotMatchException(PriceNotMatchingException e) {
		log.error("Price does not match. Expected ( {} ), received ( {} )",
				e.getExpectedPrice(), e.getActualPrice(), e
		);
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(e.getMessage());
	}


	private String messageOrDefault(String message) {
		if (message == null || message.isBlank()) {
			return "no associated message";
		}
		return message;
	}
}

