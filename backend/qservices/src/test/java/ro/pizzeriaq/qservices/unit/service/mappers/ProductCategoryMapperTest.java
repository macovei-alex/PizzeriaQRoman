package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entities.ProductCategory;
import ro.pizzeriaq.qservices.data.dtos.ProductCategoryDto;
import ro.pizzeriaq.qservices.services.mappers.ProductCategoryMapper;

import static org.junit.jupiter.api.Assertions.*;

public class ProductCategoryMapperTest {

	final ProductCategoryMapper productCategoryMapper = new ProductCategoryMapper();


	@Test
	void entityNull() {
		assertNull(productCategoryMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productCategoryMapper.fromEntity(ProductCategory.builder().build()));
		assertThrows(NullPointerException.class, () -> productCategoryMapper.fromEntity(ProductCategory.builder()
				.id(null)
				.build()));
	}

	@Test
	void entityValid() {
		ProductCategory productCategory = ProductCategory.builder()
				.id(10)
				.name("Pizza")
				.build();

		ProductCategoryDto expected = ProductCategoryDto.builder()
				.id(10)
				.name("Pizza")
				.build();

		assertEquals(expected, productCategoryMapper.fromEntity(productCategory));
	}
}
