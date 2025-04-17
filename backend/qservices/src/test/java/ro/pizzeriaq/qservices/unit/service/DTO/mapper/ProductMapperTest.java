package ro.pizzeriaq.qservices.unit.service.DTO.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.pizzeriaq.qservices.data.entity.Product;
import ro.pizzeriaq.qservices.data.entity.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductMapper;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductMapperTest {

	@Mock
	private ImageManagementService imageManagementService;

	private ProductMapper productMapper;


	@BeforeEach
	void setup() {
		assertNotNull(imageManagementService);
		productMapper = new ProductMapper(imageManagementService);
	}


	@Test
	void entityNull() {
		assertNull(productMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productMapper.fromEntity(Product.builder().build()));
		assertThrows(NullPointerException.class, () -> productMapper.fromEntity(Product.builder()
				.id(null)
				.category(ProductCategory.builder().id(1).build())
				.build()));
		assertThrows(NullPointerException.class, () -> productMapper.fromEntity(Product.builder()
				.id(1)
				.category(null)
				.build()));
		assertThrows(NullPointerException.class, () -> productMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(null).build())
				.build()));
	}

	@Test
	void minimalNotThrowCases() {
		assertDoesNotThrow(() -> productMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(1).build())
				.build()));
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

		assertEquals(expected, productMapper.fromEntity(product));
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

		assertEquals(expected, productMapper.fromEntity(product));
	}
}
