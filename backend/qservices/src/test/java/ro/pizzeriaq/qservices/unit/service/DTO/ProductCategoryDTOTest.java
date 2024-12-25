package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class ProductCategoryDTOTest {

	@Test
	void entityNull() {
		assert (ProductCategoryDTO.fromEntity(null) == null);
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> ProductCategoryDTO.fromEntity(ProductCategory.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> ProductCategoryDTO.fromEntity(ProductCategory.builder()
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

		assertEquals(expected, ProductCategoryDTO.fromEntity(productCategory));
	}
}
