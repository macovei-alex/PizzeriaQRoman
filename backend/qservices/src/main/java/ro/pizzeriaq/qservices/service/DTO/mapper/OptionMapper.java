package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.service.DTO.OptionDTO;

@Service
public class OptionMapper {


	public OptionDTO fromEntity(Option option) {
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
