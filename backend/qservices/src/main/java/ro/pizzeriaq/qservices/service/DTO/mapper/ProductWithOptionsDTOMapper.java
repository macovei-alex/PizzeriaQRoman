package ro.pizzeriaq.qservices.service.DTO.mappers;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductWithOptionsDTOMapper {

	private final ImageManagementService imageManagementService;

	public ProductWithOptionsDTOMapper(ImageManagementService imageManagementService) {
		this.imageManagementService = imageManagementService;
	}

	public ProductWithOptionsDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		ProductWithOptionsDTO productDto = new ProductWithOptionsDTO();
		productDto.setId(product.getId());
		productDto.setName(product.getName());
		productDto.setSubtitle(product.getSubtitle());
		productDto.setDescription(product.getDescription());
		productDto.setPrice(product.getPrice());
		productDto.setImageName(imageManagementService.imageExists(product.getImageName())
						? product.getImageName()
						: null);
		productDto.setCategoryId(product.getCategory().getId());


		List<OptionListDTO> optionListDTOS = new ArrayList<>();
		for (OptionList optionList : product.getOptionLists()) {
			optionListDTOS.add(OptionListDTO.fromEntity(optionList));
		}

		productDto.setOptionLists(optionListDTOS);

		return productDto;
	}
}
