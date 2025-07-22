package ro.pizzeriaq.qservices.exceptions;

public class ImageFormatException extends RuntimeException {

		public ImageFormatException(String message) {
				super(message);
		}

		public ImageFormatException(String message, Throwable cause) {
				super(message, cause);
		}

}
