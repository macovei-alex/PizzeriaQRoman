package ro.pizzeriaq.qservices.unit.repository;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.pizzeriaq.qservices.config.TestcontainersBase;
import ro.pizzeriaq.qservices.data.entities.Product;
import ro.pizzeriaq.qservices.repositories.ProductRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.util.function.Predicate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Slf4j
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProductRepositoryTest extends TestcontainersBase {

	@Value("app.environment")
	String environment;

	@Autowired
	ProductRepository productRepository;
	@Autowired
	EntityInitializerService entityInitializerService;


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
	void findAllActive() {
		var products = productRepository.findAllActive();

		assertEquals(8, products.size());
		assertEquals(9, productRepository.findAll().size());

		assertThat(products.stream()
				.anyMatch((p) -> p.getName().equals("Sprite"))
		).isTrue();

		assertThat(products.stream()
				.noneMatch((p) -> p.getName().equals("Deleted sprite"))
		).isTrue();
	}

	@Test
	void findById() {
		var products = productRepository.findAll();

		var activeProductId = products.stream()
				.filter(Product::isActive)
				.findFirst()
				.orElseThrow()
				.getId();
		var inactiveProductId = products.stream()
				.filter(Predicate.not(Product::isActive))
				.findFirst()
				.orElseThrow()
				.getId();

		assertThat(productRepository.findById(activeProductId)).isNotEmpty();
		assertThat(productRepository.findById(inactiveProductId)).isNotEmpty();
		assertThat(productRepository.findByIdOptionListsPreload(activeProductId)).isNotEmpty();
		assertThat(productRepository.findByIdOptionListsPreload(inactiveProductId)).isNotEmpty();
	}
}
