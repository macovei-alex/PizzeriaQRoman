package ro.pizzeriaq.qservices.controller.exceptions.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);


	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
		logger.error("Illegal argument exception: {}", e.getMessage());

		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(e.getMessage());
	}


	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleGeneralException(Exception e) {
		logger.error("Unexpected error: {}", e.getMessage());

		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("An unexpected error occurred: " + e.getMessage());
	}
}

