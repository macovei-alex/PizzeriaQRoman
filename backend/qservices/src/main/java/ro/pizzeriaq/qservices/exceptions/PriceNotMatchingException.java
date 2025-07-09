package ro.pizzeriaq.qservices.exceptions;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class PriceNotMatchingException extends RuntimeException {

	private final BigDecimal expectedPrice;
	private final BigDecimal actualPrice;

	public PriceNotMatchingException(String message, BigDecimal expectedPrice, BigDecimal actualPrice) {
		super(message);
		this.expectedPrice = expectedPrice;
		this.actualPrice = actualPrice;
	}

}
