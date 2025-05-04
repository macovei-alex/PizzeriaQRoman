package ro.pizzeriaq.qservices.exceptions.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);


	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleGeneralException(Exception e) {
		logger.error("Unexpected error", e);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("An unexpected error occurred: " + e.getMessage());
	}


	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
		logger.error("Illegal argument exception", e);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}


	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleInvalidData(MethodArgumentNotValidException e) {
		Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField, (field) -> messageOrDefault(field.getDefaultMessage())));

		logger.error("Invalid data received", e);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
	}


	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<String> handleInvalidData(MethodArgumentTypeMismatchException e) {
		logger.error("Invalid data received", e);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}


	@ExceptionHandler(KeycloakException.class)
	public ResponseEntity<String> handleKeycloakException(KeycloakException e) {
		logger.error("Keycloak error", e);
		return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
	}


	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<String> handleNoResourceFoundException(NoResourceFoundException e) {
		logger.error("Resource not found", e);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	}


	private String messageOrDefault(String message) {
		if (message == null || message.isEmpty() || message.isBlank()) {
			return "no associated message";
		}
		return message;
	}
}

