package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.OptionListMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductCategoryMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductWithOptionsMapper;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductWithOptionsMapperTest {

	@Mock
	private ImageManagementService imageManagementService;
	@Mock
	private OptionListMapper optionListMapper;
	private ProductWithOptionsMapper productWithOptionsMapper;


	@BeforeEach
	void setup() {
		assertNotNull(imageManagementService);
		assertNotNull(optionListMapper);
		productWithOptionsMapper = new ProductWithOptionsMapper(imageManagementService, optionListMapper);
	}


	@Test
	void entityNull() {
		assertNull(productWithOptionsMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(
				Product.builder().build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(
				Product.builder().id(null).build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(
				Product.builder().id(1).category(null).build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(
				Product.builder().id(1).category(ProductCategory.builder().id(null).build()).build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(
				Product.builder().id(1).category(ProductCategory.builder().id(1).build()).optionLists(null).build()));
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
				.optionLists(List.of())
				.category(ProductCategory.builder().id(2).name("Pizza").build())
				.build();

		ProductWithOptionsDTO expected = ProductWithOptionsDTO.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName("generic-pizza.jpg")
				.categoryId(2)
				.optionLists(List.of())
				.build();

		assertEquals(expected, productWithOptionsMapper.fromEntity(product));
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
				.optionLists(List.of())
				.category(ProductCategory.builder().id(2).name("Pizza").build())
				.build();

		ProductWithOptionsDTO expected = ProductWithOptionsDTO.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName(null)
				.categoryId(2)
				.optionLists(List.of())
				.build();

		assertEquals(expected, productWithOptionsMapper.fromEntity(product));
	}
}
