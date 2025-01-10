package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductWithOptionsDTOMapper;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ProductWithOptionsDTOTest {

	private final ImageManagementService imageManagementService = new ImageManagementService();

	private final ProductWithOptionsDTOMapper productWithOptionsDTOMapper = new ProductWithOptionsDTOMapper(imageManagementService);


	@Test
	void entityNull() {
		assertNull(productWithOptionsDTOMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productWithOptionsDTOMapper.fromEntity(
				Product.builder().build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsDTOMapper.fromEntity(
				Product.builder().id(null).build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsDTOMapper.fromEntity(
				Product.builder().id(1).category(null).build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsDTOMapper.fromEntity(
				Product.builder().id(1).category(ProductCategory.builder().id(null).build()).build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsDTOMapper.fromEntity(
				Product.builder().id(1).category(ProductCategory.builder().id(1).build()).optionLists(null).build()));
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

		assertEquals(expected, productWithOptionsDTOMapper.fromEntity(product));
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

		assertEquals(expected, productWithOptionsDTOMapper.fromEntity(product));
	}
}
