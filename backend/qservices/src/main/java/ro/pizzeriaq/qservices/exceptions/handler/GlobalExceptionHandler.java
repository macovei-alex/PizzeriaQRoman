package ro.pizzeriaq.qservices.exceptions.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);


	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleGeneralException(Exception e) {
		logger.error("Unexpected error: {}", e.getMessage());

		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("An unexpected error occurred: " + e.getMessage());
	}


	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
		logger.error("Illegal argument exception: {}", e.getMessage());

		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(e.getMessage());
	}


	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleInvalidData(MethodArgumentNotValidException e) {
		Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField, (field) -> messageOrDefault(field.getDefaultMessage())));

		logger.error("Invalid data received: {}", errors);

		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(errors);
	}

	private String messageOrDefault(String message) {
		if (message == null || message.isEmpty() || message.isBlank()) {
			return "no associated message";
		}
		return message;
	}
}

