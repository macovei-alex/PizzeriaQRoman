package ro.pizzeriaq.qservices.exceptions;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class PriceMismatchException extends RuntimeException {

	private final BigDecimal expectedPrice;
	private final BigDecimal actualPrice;

	public PriceMismatchException(String message, BigDecimal expectedPrice, BigDecimal actualPrice) {
		super(message);
		this.expectedPrice = expectedPrice;
		this.actualPrice = actualPrice;
	}

}
