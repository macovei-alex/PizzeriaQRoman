package ro.pizzeriaq.qservices.services.mappers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.dtos.ProductDto;
import ro.pizzeriaq.qservices.data.entities.Product;
import ro.pizzeriaq.qservices.services.ImageService;

@Slf4j
@Component
@AllArgsConstructor
public class ProductMapper {

	private final ImageService imageService;


	public ProductDto fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		var imageExists = imageService.imageExists(product.getImageName());
		if (!imageExists) {
			log.warn("Image not found: {}. ProductDTO will have null for image name and 0 for image version", product.getImageName());
		}

		return ProductDto.builder()
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
