package ro.pizzeriaq.qservices.unit.entities;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.DataJpaTestConfig;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.Product;
import ro.pizzeriaq.qservices.repositories.ProductCategoryRepository;
import ro.pizzeriaq.qservices.repositories.ProductRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTestConfig
class ProductConstraintsTest {

	@Autowired
	ProductRepository productRepository;
	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	private ProductCategoryRepository productCategoryRepository;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL);
		RepositoryTestConfig.addDynamicProperties(registry);
	}


	@BeforeAll
	void setUp() {
		EntityInitializerService.reInitializeEntities(entityInitializerService);
	}

	@AfterAll
	void tearDown() {
		entityInitializerService.deleteAll();
	}


	private Product buildValidProduct() {
		var category = productCategoryRepository.findAllOrderBySortIdAsc().get(0);
		return Product.builder()
				.category(category)
				.id(null)
				.name("a".repeat(60))
				.subtitle("a".repeat(100))
				.description("a".repeat(1000))
				.price(BigDecimal.valueOf(123456.78))
				.imageName("image.png")
				.isActive(true)
				.build();
	}

	@Test
	void validProduct() {
		var saved = productRepository.save(buildValidProduct());
		assertNotNull(saved);
		assertNotNull(saved.getId());
		assertTrue(saved.isActive());
	}

	@Test
	void idNull() {
		var product = buildValidProduct();
		product.setId(null);

		var saved = productRepository.saveAndFlush(product);
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = productRepository.saveAndFlush(buildValidProduct());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> productRepository.saveAndFlush(saved));
	}

	@Test
	void categoryNull() {
		Product product = buildValidProduct();
		product.setCategory(null);

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void nameNull() {
		Product product = buildValidProduct();
		product.setName(null);

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void nameTooLong() {
		Product product = buildValidProduct();
		product.setName("a".repeat(61)); // > 60 chars

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void subtitleNull() {
		var product = buildValidProduct();
		product.setSubtitle(null);

		assertDoesNotThrow(() -> productRepository.saveAndFlush(product));
	}

	@Test
	void subtitleTooLong() {
		Product product = buildValidProduct();
		product.setSubtitle("a".repeat(101)); // > 100 chars

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void descriptionNull() {
		var product = buildValidProduct();
		product.setDescription(null);

		assertDoesNotThrow(() -> productRepository.saveAndFlush(product));
	}

	@Test
	void descriptionTooLong() {
		Product product = buildValidProduct();
		product.setDescription("a".repeat(1001));

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void priceNull() {
		Product product = buildValidProduct();
		product.setPrice(null);

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void priceTooManyDigits() {
		Product product = buildValidProduct();
		product.setPrice(BigDecimal.valueOf(1234567.89));

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void imageNull() {
		Product product = buildValidProduct();
		product.setImageName(null);

		assertThrows(DataIntegrityViolationException.class, () -> productRepository.saveAndFlush(product));
	}

	@Test
	void isActiveDefault() {
		var category = productCategoryRepository.findAllOrderBySortIdAsc().get(0);
		var product = Product.builder()
				.category(category)
				.name("Product with default isActive")
				.price(BigDecimal.TEN)
				.imageName("img.jpg")
				.build();

		var saved = productRepository.save(product);
		assertNotNull(saved);
		assertTrue(saved.isActive());
	}
}
