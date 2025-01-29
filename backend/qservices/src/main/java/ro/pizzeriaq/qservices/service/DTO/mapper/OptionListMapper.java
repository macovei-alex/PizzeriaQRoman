package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.service.DTO.OptionDTO;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;

import java.util.ArrayList;
import java.util.List;

@Service
public class OptionListMapper {

	private final OptionMapper optionMapper;


	public OptionListMapper(OptionMapper optionMapper) {
		this.optionMapper = optionMapper;
	}


	public OptionListDTO fromEntity(OptionList optionList) {
		if (optionList == null) {
			return null;
		}

		OptionListDTO optionListDTO = new OptionListDTO();
		optionListDTO.setId(optionList.getId());
		optionListDTO.setText(optionList.getText());
		optionListDTO.setMinChoices(optionList.getMinChoices());
		optionListDTO.setMaxChoices(optionList.getMaxChoices());

		List<OptionDTO> optionDTOs = new ArrayList<>();
		for (Option option : optionList.getOptions()) {
			optionDTOs.add(optionMapper.fromEntity(option));
		}

		optionListDTO.setOptions(optionDTOs);

		return optionListDTO;
	}
}
