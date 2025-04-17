package ro.pizzeriaq.qservices.service.DTO.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.entity.Product;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;

@Service
@AllArgsConstructor
public class ProductWithOptionsMapper {

	private final ImageManagementService imageManagementService;
	private final OptionListMapper optionListMapper;


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
