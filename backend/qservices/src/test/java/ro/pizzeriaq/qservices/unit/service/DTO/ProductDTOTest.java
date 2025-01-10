package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductDTOMapper;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class ProductDTOTest {

	private final ImageManagementService imageManagementService = new ImageManagementService();
	
	private final ProductDTOMapper productDTOMapper = new ProductDTOMapper(imageManagementService);


	@Test
	void entityNull() {
		assertNull(productDTOMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productDTOMapper.fromEntity(Product.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> productDTOMapper.fromEntity(Product.builder()
				.id(null).build()));
		assertThrows(NullPointerException.class, () -> productDTOMapper.fromEntity(Product.builder()
				.id(1).category(null).build()));
		assertThrows(NullPointerException.class, () -> productDTOMapper.fromEntity(Product.builder()
				.id(1).category(ProductCategory.builder().id(null).build()).build()));
	}

	@Test
	void entityValid() {
		Product product = Product.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName("generic-pizza.jpg")
				.category(ProductCategory.builder().id(2).build())
				.build();

		ProductDTO expected = ProductDTO.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName("generic-pizza.jpg")
				.categoryId(2)
				.build();

		assertEquals(expected, productDTOMapper.fromEntity(product));
	}

	@Test
	void entityWithMissingImage() {
		Product product = Product.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName("non-existent-file.jpg")
				.category(ProductCategory.builder().id(2).build())
				.build();

		ProductDTO expected = ProductDTO.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName(null)
				.categoryId(2)
				.build();

		assertEquals(expected, productDTOMapper.fromEntity(product));
	}
}
