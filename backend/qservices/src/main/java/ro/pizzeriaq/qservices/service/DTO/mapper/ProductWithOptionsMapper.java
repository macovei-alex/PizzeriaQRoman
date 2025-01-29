package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductWithOptionsMapper {

	private final ImageManagementService imageManagementService;
	private final OptionListMapper optionListMapper;


	public ProductWithOptionsMapper(
			ImageManagementService imageManagementService,
			OptionListMapper optionListMapper) {
		this.imageManagementService = imageManagementService;
		this.optionListMapper = optionListMapper;
	}


	public ProductWithOptionsDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		return ProductWithOptionsDTO.builder()
				.id(product.getId())
				.name(product.getName())
				.subtitle(product.getSubtitle())
				.description(product.getDescription())
				.price(product.getPrice())
				.imageName(imageManagementService.imageExists(product.getImageName())
						? product.getImageName()
						: null)
				.categoryId(product.getCategory().getId())
				.optionLists(product.getOptionLists().stream().map(optionListMapper::fromEntity).toList())
				.build();
	}
}
