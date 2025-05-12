package ro.pizzeriaq.qservices.service.mappers;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Product;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.ImageService;

@Component
@AllArgsConstructor
public class ProductMapper {

	private static final Logger logger = LoggerFactory.getLogger(ProductMapper.class);


	private final ImageService imageService;


	public ProductDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		var imageExists = imageService.imageExists(product.getImageName());
		if (!imageExists) {
			logger.warn("Image not found: {}. ProductDTO will have null for image name and 0 for image version", product.getImageName());
		}

		return ProductDTO.builder()
				.id(product.getId())
				.name(product.getName())
				.subtitle(product.getSubtitle())
				.description(product.getDescription())
				.price(product.getPrice())
				.imageName(imageExists ? product.getImageName() : null)
				.imageVersion(imageExists ? imageService.getImageTimestamp(product.getImageName()) : 0)
				.categoryId(product.getCategory().getId())
				.build();
	}
}
