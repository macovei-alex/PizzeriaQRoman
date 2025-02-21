package ro.pizzeriaq.qservices.service.DTO.mapper;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;

@Service
@AllArgsConstructor
public class ProductMapper {

	private static final Logger logger = LoggerFactory.getLogger(ProductMapper.class);

	private final ImageManagementService imageManagementService;


	public ProductDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		ProductDTO productDto = ProductDTO.builder()
				.id(product.getId())
				.name(product.getName())
				.subtitle(product.getSubtitle())
				.description(product.getDescription())
				.price(product.getPrice())
				.imageName(imageManagementService.imageExists(product.getImageName())
						? product.getImageName()
						: null)
				.categoryId(product.getCategory().getId())
				.build();

		if (productDto.getImageName() == null) {
			logger.warn("Image not found: {}. ProductDTO will have null for image name", product.getImageName());
		}

		return productDto;
	}
}
