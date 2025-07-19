package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entities.OptionList;
import ro.pizzeriaq.qservices.data.entities.Product;
import ro.pizzeriaq.qservices.data.entities.ProductCategory;
import ro.pizzeriaq.qservices.data.dtos.ProductWithOptionsDto;
import ro.pizzeriaq.qservices.services.mappers.OptionListMapper;
import ro.pizzeriaq.qservices.services.mappers.ProductWithOptionsMapper;
import ro.pizzeriaq.qservices.services.ImageService;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ProductWithOptionsMapperTest {

	final ImageService imageService = mock(ImageService.class);
	final OptionListMapper optionListMapper = mock(OptionListMapper.class);
	final ProductWithOptionsMapper productWithOptionsMapper
			= new ProductWithOptionsMapper(imageService, optionListMapper);


	OptionList nullOptionList() {
		return null;
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

		ProductWithOptionsDto expected = ProductWithOptionsDto.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName("generic-pizza.jpg")
				.categoryId(2)
				.optionLists(List.of())
				.isActive(true)
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

		ProductWithOptionsDto expected = ProductWithOptionsDto.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName(null)
				.categoryId(2)
				.optionLists(List.of())
				.isActive(true)
				.build();

		assertEquals(expected, productWithOptionsMapper.fromEntity(product));
	}

	@Test
	void inactiveEntity() {
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
				.isActive(false)
				.build();

		ProductWithOptionsDto expected = ProductWithOptionsDto.builder()
				.id(10)
				.name("Pizza")
				.subtitle("Pizza subtitle")
				.description("Pizza description")
				.price(BigDecimal.valueOf(30.0))
				.imageName("generic-pizza.jpg")
				.categoryId(2)
				.optionLists(List.of())
				.isActive(false)
				.build();

		assertEquals(expected, productWithOptionsMapper.fromEntity(product));
	}
}
