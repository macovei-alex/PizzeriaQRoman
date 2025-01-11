package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;

@Service
public class ProductDTOMapper {

	private static final Logger logger = LoggerFactory.getLogger(ProductDTOMapper.class);

	private final ImageManagementService imageManagementService;

	public ProductDTOMapper(ImageManagementService imageManagementService) {
		this.imageManagementService = imageManagementService;
	}

	public ProductDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		ProductDTO productDto = new ProductDTO();
		productDto.setId(product.getId());
		productDto.setName(product.getName());
		productDto.setSubtitle(product.getSubtitle());
		productDto.setDescription(product.getDescription());
		productDto.setPrice(product.getPrice());
		productDto.setImageName(imageManagementService.imageExists(product.getImageName())
						? product.getImageName()
						: null);
		productDto.setCategoryId(product.getCategory().getId());

		if (productDto.getImageName() == null) {
			logger.warn("Image not found: {}. ProductDTO will have null for image name", product.getImageName());
		}

		return productDto;
	}
}
