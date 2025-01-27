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

	public ProductWithOptionsMapper(ImageManagementService imageManagementService) {
		this.imageManagementService = imageManagementService;
	}

	public ProductWithOptionsDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		ProductWithOptionsDTO productDto = ProductWithOptionsDTO.builder()
				.id(product.getId())
				.name(product.getName())
				.subtitle(product.getSubtitle())
				.description(product.getDescription())
				.price(product.getPrice())
				.imageName(imageManagementService.imageExists(product.getImageName())
						? product.getImageName()
						: null)
				.categoryId(product.getCategory().getId())
				.optionLists(product.getOptionLists().stream().map(OptionListDTO::fromEntity).toList())
				.build();

		return productDto;
	}
}
