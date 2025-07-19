package ro.pizzeriaq.qservices.unit.entities;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.DataJpaTestConfig;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.ProductCategory;
import ro.pizzeriaq.qservices.repositories.ProductCategoryRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Slf4j
@DataJpaTestConfig
class ProductCategoryConstraintsTest {

	@Value("${app.environment}")
	String environment;

	@Autowired
	ProductCategoryRepository productCategoryRepository;
	@Autowired
	EntityInitializerService entityInitializerService;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL);
		RepositoryTestConfig.addDynamicProperties(registry);
	}


	@BeforeAll
	void setUp() {
		log.info("Environment: {}", environment);
		EntityInitializerService.reInitializeEntities(entityInitializerService);
	}

	@AfterAll
	void tearDown() {
		entityInitializerService.deleteAll();
	}


	private ProductCategory buildValidCategory() {
		return ProductCategory.builder()
				.name("a".repeat(40))
				.sortId(12345)
				.build();
	}


	@Test
	void validCategory() {
		var saved = productCategoryRepository.save(buildValidCategory());
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void idNull() {
		var category = buildValidCategory();
		category.setId(null);

		var saved = productCategoryRepository.saveAndFlush(category);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = productCategoryRepository.saveAndFlush(buildValidCategory());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> productCategoryRepository.saveAndFlush(saved));
	}

	@Test
	void nameNull() {
		var category = buildValidCategory();
		category.setName(null);

		assertThrows(DataIntegrityViolationException.class, () -> productCategoryRepository.saveAndFlush(category));
	}

	@Test
	void nameTooLong() {
		var category = buildValidCategory();
		category.setName("a".repeat(41));
		assertThrows(DataIntegrityViolationException.class, () -> productCategoryRepository.saveAndFlush(category));
	}

	@Test
	void nameDuplicate() {
		var category1 = buildValidCategory();
		var category2 = buildValidCategory();
		category2.setName(category1.getName());
		category2.setSortId(category1.getSortId() + 1);

		productCategoryRepository.saveAndFlush(category1);
		assertThrows(DataIntegrityViolationException.class, () -> productCategoryRepository.saveAndFlush(category2));
	}

	@Test
	void sortIdNull() {
		var category = buildValidCategory();
		category.setSortId(null);
		assertThrows(DataIntegrityViolationException.class, () -> productCategoryRepository.saveAndFlush(category));
	}

	@Test
	void sortIdDuplicate() {
		var category1 = buildValidCategory();
		productCategoryRepository.saveAndFlush(category1);

		var category2 = buildValidCategory();
		category2.setName(category1.getName().replace('a', 'b'));
		category2.setSortId(category1.getSortId());
		assertThrows(DataIntegrityViolationException.class, () -> productCategoryRepository.saveAndFlush(category2));
	}
}

