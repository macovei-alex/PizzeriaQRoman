package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductDTOMapper;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductDTOMapperTest {

	@Mock
	private ImageManagementService imageManagementService;

	private ProductDTOMapper productDTOMapper;


	@BeforeEach
	void setup() {
		assertNotNull(imageManagementService);
		productDTOMapper = new ProductDTOMapper(imageManagementService);
	}


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
		when(imageManagementService.imageExists("generic-pizza.jpg"))
				.thenReturn(true);

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
		when(imageManagementService.imageExists("non-existent-file.jpg"))
				.thenReturn(false);

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
