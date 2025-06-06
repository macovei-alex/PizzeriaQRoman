package ro.pizzeriaq.qservices.services.mappers;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.Option;
import ro.pizzeriaq.qservices.data.entities.OptionList;
import ro.pizzeriaq.qservices.data.dtos.OptionListDto;

@Component
public class OptionListMapper {

	public OptionListDto fromEntity(OptionList optionList) {
		if (optionList == null) {
			return null;
		}

		return OptionListDto.builder()
				.id(optionList.getId())
				.text(optionList.getText())
				.minChoices(optionList.getMinChoices())
				.maxChoices(optionList.getMaxChoices())
				.options(optionList.getOptions().stream().map(this::mapOption).toList())
				.build();
	}


	private OptionListDto.Option mapOption(Option option) {
		assert option != null;

		return OptionListDto.Option.builder()
				.id(option.getId())
				.name(option.getName())
				.additionalDescription(option.getAdditionalDescription())
				.price(option.getPrice())
				.minCount(option.getMinCount())
				.maxCount(option.getMaxCount())
				.build();
	}
}
