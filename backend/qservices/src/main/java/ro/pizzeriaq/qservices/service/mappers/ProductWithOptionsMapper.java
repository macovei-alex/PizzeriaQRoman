package ro.pizzeriaq.qservices.service.mappers;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Product;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.ImageService;

@Component
@AllArgsConstructor
public class ProductWithOptionsMapper {

	private static final Logger logger = LoggerFactory.getLogger(ProductWithOptionsMapper.class);


	private final ImageService imageService;
	private final OptionListMapper optionListMapper;


	public ProductWithOptionsDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		var imageExists = imageService.imageExists(product.getImageName());

		if (!imageExists) {
			logger.warn("Image not found: {}. ProductWithOptionsDTO will have null for image name and 0 for image version", product.getImageName());
		}

		return ProductWithOptionsDTO.builder()
				.id(product.getId())
				.name(product.getName())
				.subtitle(product.getSubtitle())
				.description(product.getDescription())
				.price(product.getPrice())
				.imageName(imageExists ? product.getImageName() : null)
				.imageVersion(imageExists ? imageService.getImageTimestamp(product.getImageName()) : 0)
				.categoryId(product.getCategory().getId())
				.optionLists(product.getOptionLists().stream().map(optionListMapper::fromEntity).toList())
				.build();
	}
}
