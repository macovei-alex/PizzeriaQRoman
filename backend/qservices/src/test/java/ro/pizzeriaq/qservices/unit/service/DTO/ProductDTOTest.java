package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class ProductDTOTest {

	@Test
	void entityNull() {
		assert (ProductDTO.fromEntity(null) == null);
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> ProductDTO.fromEntity(Product.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> ProductDTO.fromEntity(Product.builder()
				.id(null).build()));
		assertThrows(NullPointerException.class, () -> ProductDTO.fromEntity(Product.builder()
				.id(1).category(null).build()));
		assertThrows(NullPointerException.class, () -> ProductDTO.fromEntity(Product.builder()
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
				.image("pizza.jpg")
				.category(ProductCategory.builder().id(2).build())
				.build();

		ProductDTO expected = ProductDTO.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageUrl("pizza.jpg")
				.categoryId(2)
				.build();

		assertEquals(expected, ProductDTO.fromEntity(product));
	}
}
