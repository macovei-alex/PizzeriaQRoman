package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;


@Data
@Builder
public class OptionListDTO {

	private int id;
	private String text;
	private int minChoices;
	private int maxChoices;
	private List<Option> options;


	@Data
	@Builder
	public static class Option {
		private int id;
		private String name;
		private String additionalDescription;
		private BigDecimal price;
		private int minCount;
		private int maxCount;
	}

}
