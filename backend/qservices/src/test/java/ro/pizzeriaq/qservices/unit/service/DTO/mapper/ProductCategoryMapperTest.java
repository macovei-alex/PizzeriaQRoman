package ro.pizzeriaq.qservices.unit.service.DTO.mapper;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductCategoryMapper;

import static org.junit.jupiter.api.Assertions.*;

public class ProductCategoryMapperTest {

	private final ProductCategoryMapper productCategoryMapper = new ProductCategoryMapper();


	@Test
	void entityNull() {
		assertNull(productCategoryMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productCategoryMapper.fromEntity(ProductCategory.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> productCategoryMapper.fromEntity(ProductCategory.builder()
				.id(null).build()));
	}

	@Test
	void entityValid() {
		ProductCategory productCategory = ProductCategory.builder()
				.id(10)
				.name("Pizza")
				.build();

		ProductCategoryDTO expected = ProductCategoryDTO.builder()
				.id(10)
				.name("Pizza")
				.build();

		assertEquals(expected, productCategoryMapper.fromEntity(productCategory));
	}
}
