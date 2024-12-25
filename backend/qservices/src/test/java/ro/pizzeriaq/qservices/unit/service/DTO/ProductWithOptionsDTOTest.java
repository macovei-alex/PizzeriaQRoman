package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ProductWithOptionsDTOTest {

	@Test
	void entityNull() {
		assertNull(ProductWithOptionsDTO.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> ProductWithOptionsDTO.fromEntity(Product.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> ProductWithOptionsDTO.fromEntity(Product.builder()
				.id(null).build()));
		assertThrows(NullPointerException.class, () -> ProductWithOptionsDTO.fromEntity(Product.builder()
				.id(1).category(null).build()));
		assertThrows(NullPointerException.class, () -> ProductWithOptionsDTO.fromEntity(Product.builder()
				.id(1).category(ProductCategory.builder().id(null).build()).build()));
		assertThrows(NullPointerException.class, () -> ProductWithOptionsDTO.fromEntity(Product.builder()
				.id(1).category(ProductCategory.builder().id(1).build()).optionLists(null).build()));
	}

	@Test
	void entityValid() {
		Product product = Product.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.image("pizza.jpg")
				.optionLists(List.of())
				.category(ProductCategory.builder().id(2).name("Pizza").build())
				.build();

		ProductWithOptionsDTO expected = ProductWithOptionsDTO.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageUrl("pizza.jpg")
				.categoryId(2)
				.optionLists(List.of())
				.build();

		assertEquals(expected, ProductWithOptionsDTO.fromEntity(product));
	}
}
