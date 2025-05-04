package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Option;
import ro.pizzeriaq.qservices.data.entity.OptionList;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;

@Component
public class OptionListMapper {

	public OptionListDTO fromEntity(OptionList optionList) {
		if (optionList == null) {
			return null;
		}

		return OptionListDTO.builder()
				.id(optionList.getId())
				.text(optionList.getText())
				.minChoices(optionList.getMinChoices())
				.maxChoices(optionList.getMaxChoices())
				.options(optionList.getOptions().stream().map(this::mapOption).toList())
				.build();
	}


	private OptionListDTO.Option mapOption(Option option) {
		assert option != null;

		return OptionListDTO.Option.builder()
				.id(option.getId())
				.name(option.getName())
				.additionalDescription(option.getAdditionalDescription())
				.price(option.getPrice())
				.minCount(option.getMinCount())
				.maxCount(option.getMaxCount())
				.build();
	}
}
