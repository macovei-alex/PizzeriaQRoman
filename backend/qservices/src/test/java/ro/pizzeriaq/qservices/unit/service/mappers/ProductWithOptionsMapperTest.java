package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.pizzeriaq.qservices.data.entity.OptionList;
import ro.pizzeriaq.qservices.data.entity.Product;
import ro.pizzeriaq.qservices.data.entity.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.mappers.OptionListMapper;
import ro.pizzeriaq.qservices.service.mappers.ProductWithOptionsMapper;
import ro.pizzeriaq.qservices.service.ImageService;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductWithOptionsMapperTest {

	@Mock
	private ImageService imageService;
	@Mock
	private OptionListMapper optionListMapper;

	private ProductWithOptionsMapper productWithOptionsMapper;


	OptionList nullOptionList() {
		return null;
	}

	@BeforeEach
	void setup() {
		if (productWithOptionsMapper == null) {
			productWithOptionsMapper = new ProductWithOptionsMapper(imageService, optionListMapper);
		}
		assertNotNull(productWithOptionsMapper);
		assertNotNull(imageService);
		assertNotNull(optionListMapper);
	}


	@Test
	void entityNull() {
		assertNull(productWithOptionsMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(Product.builder().build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(null)
				.category(ProductCategory.builder().id(1).build())
				.optionLists(List.of())
				.build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(1)
				.category(null)
				.optionLists(List.of())
				.build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(null).build())
				.optionLists(List.of())
				.build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(1).build())
				.optionLists(null)
				.build()));
		assertThrows(NullPointerException.class, () -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(1).build())
				.optionLists(List.of(nullOptionList()))
				.build()));
	}

	@Test
	void minimalNotThrowCases() {
		assertDoesNotThrow(() -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(1).build())
				.optionLists(List.of())
				.build()));
		assertDoesNotThrow(() -> productWithOptionsMapper.fromEntity(Product.builder()
				.id(1)
				.category(ProductCategory.builder().id(1).build())
				.optionLists(List.of(OptionList.builder().id(1).options(List.of()).build()))
				.build()));
	}

	@Test
	void entityValid() {
		when(imageService.imageExists("generic-pizza.jpg"))
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
		when(imageService.imageExists("non-existent-file.jpg"))
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
