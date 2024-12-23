package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;
import ro.pizzeriaq.qservices.data.model.Option;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class OptionDTO {

	private int id;
	private String name;
	private String additionalDescription;
	private BigDecimal price;
	private int minCount;
	private int maxCount;


	public static OptionDTO fromEntity(Option option) {
		if (option == null) {
			return null;
		}

		OptionDTO optionDTO = new OptionDTO();
		optionDTO.setId(option.getId());
		optionDTO.setName(option.getName());
		optionDTO.setAdditionalDescription(option.getAdditionalDescription());
		optionDTO.setPrice(option.getPrice());
		optionDTO.setMinCount(option.getMinCount());
		optionDTO.setMaxCount(option.getMaxCount());
		return optionDTO;
	}
}
