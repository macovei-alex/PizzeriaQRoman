package ro.pizzeriaq.qservices.unit.repository;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.Product;
import ro.pizzeriaq.qservices.repositories.ProductRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.util.function.Predicate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
public class ProductRepositoryTest {

	@Value("app.environment")
	String environment;

	@Autowired
	ProductRepository productRepository;
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


	@Test
	void findAll() {
		var activeProducts = productRepository.findAllActive();

		assertEquals(44, activeProducts.size());
		assertEquals(45, productRepository.findAll().size());

		assertTrue(activeProducts.stream().allMatch(Product::isActive));
		assertTrue(activeProducts.stream().anyMatch((p) -> p.getName().equals("Sprite")));
		assertTrue(activeProducts.stream().noneMatch((p) -> p.getName().equals("Deleted sprite")));
		assertTrue(activeProducts.stream().noneMatch((p) -> Hibernate.isInitialized(p.getCategory())));
	}

	@Test
	void findAllActiveCategoryPreload() {
		var products = productRepository.findAllActiveCategoryPreload();

		assertEquals(44, products.size());
		assertTrue(products.stream().allMatch((p) -> Hibernate.isInitialized(p.getCategory())));
		assertTrue(products.stream().noneMatch((p) -> Hibernate.isInitialized(p.getOptionLists())));
	}

	@Test
	void findById() {
		var products = productRepository.findAll();

		var activeProduct = productRepository.findById(products.stream()
				.filter(Product::isActive)
				.findFirst()
				.orElseThrow()
				.getId()
		);
		assertThat(activeProduct).isNotEmpty();
		assertFalse(Hibernate.isInitialized(activeProduct.get().getCategory()));
		assertFalse(Hibernate.isInitialized(activeProduct.get().getOptionLists()));

		var inactiveProduct = productRepository.findById(products.stream()
				.filter(Predicate.not(Product::isActive))
				.findFirst()
				.orElseThrow()
				.getId()
		);
		assertThat(inactiveProduct).isNotEmpty();
		assertFalse(Hibernate.isInitialized(activeProduct.get().getCategory()));
		assertFalse(Hibernate.isInitialized(inactiveProduct.get().getOptionLists()));
	}

	@Test
	void findByIdOptionListsPreload() {
		var products = productRepository.findAll();

		var activeProduct = productRepository.findByIdOptionListsPreload(products.stream()
				.filter(Product::isActive)
				.findFirst()
				.orElseThrow()
				.getId()
		);
		assertThat(activeProduct).isNotEmpty();
		assertTrue(Hibernate.isInitialized(activeProduct.get().getCategory()));
		assertTrue(Hibernate.isInitialized(activeProduct.get().getOptionLists()));

		var inactiveProduct = productRepository.findByIdOptionListsPreload(products.stream()
				.filter(Predicate.not(Product::isActive))
				.findFirst()
				.orElseThrow()
				.getId()
		);
		assertThat(inactiveProduct).isNotEmpty();
		assertTrue(Hibernate.isInitialized(inactiveProduct.get().getCategory()));
		assertTrue(Hibernate.isInitialized(inactiveProduct.get().getOptionLists()));
	}
}
