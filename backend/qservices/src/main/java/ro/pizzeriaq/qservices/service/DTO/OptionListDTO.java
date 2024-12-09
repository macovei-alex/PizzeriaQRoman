package ro.pizzeriaq.qservices.service.DTO;

import lombok.Data;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;

import java.util.ArrayList;
import java.util.List;

@Data
public class OptionListDTO {

	private int id;
	private String text;
	private int minChoices;
	private int maxChoices;
	private List<OptionDTO> options;


	public static OptionListDTO fromEntity(OptionList optionList) {
		if (optionList == null) {
			return null;
		}

		OptionListDTO optionListDTO = new OptionListDTO();
		optionListDTO.setId(optionList.getId());
		optionListDTO.setText(optionList.getText());
		optionListDTO.setMinChoices(optionList.getMinChoices());
		optionListDTO.setMaxChoices(optionList.getMaxChoices());

		List<OptionDTO> optionDTOS = new ArrayList<>();
		for (Option option : optionList.getOptions()) {
			optionDTOS.add(OptionDTO.fromEntity(option));
		}

		optionListDTO.setOptions(optionDTOS);

		return optionListDTO;
	}
}
