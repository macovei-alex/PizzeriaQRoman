package ro.pizzeriaq.qservices.exceptions;

public class ImageException extends RuntimeException {

		public ImageException(String message) {
				super(message);
		}

		public ImageException(String message, Throwable cause) {
				super(message, cause);
		}

		public ImageException(Throwable cause) {
				super(cause);
		}
}
