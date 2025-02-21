package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.service.DTO.OptionDTO;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;

@Service
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


	private OptionDTO mapOption(Option option) {
		assert option != null;

		return OptionDTO.builder()
				.id(option.getId())
				.name(option.getName())
				.additionalDescription(option.getAdditionalDescription())
				.price(option.getPrice())
				.minCount(option.getMinCount())
				.maxCount(option.getMaxCount())
				.build();
	}
}
