package ro.pizzeriaq.qservices.unit.entities;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.Option;
import ro.pizzeriaq.qservices.repositories.OptionRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
@Rollback
class OptionConstraintsTest {

	@Value("{app.environment}")
	String environment;

	@Autowired
	OptionRepository optionRepository;
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


	private Option buildValidOption() {
		return Option.builder()
				.name("a".repeat(50))
				.additionalDescription("a".repeat(100))
				.price(BigDecimal.valueOf(123456.78))
				.minCount(0)
				.maxCount(3)
				.build();
	}


	@Test
	void validOption() {
		var saved = optionRepository.save(buildValidOption());
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void idNull() {
		var option = buildValidOption();
		option.setId(null);

		var saved = optionRepository.saveAndFlush(option);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = optionRepository.saveAndFlush(buildValidOption());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> optionRepository.saveAndFlush(saved));
	}

	@Test
	void nameNull() {
		var option = buildValidOption();
		option.setName(null);

		assertThrows(DataIntegrityViolationException.class, () -> optionRepository.saveAndFlush(option));
	}

	@Test
	void nameTooLong() {
		var option = buildValidOption();
		option.setName("a".repeat(51));

		assertThrows(DataIntegrityViolationException.class, () -> optionRepository.saveAndFlush(option));
	}

	@Test
	void additionalDescriptionNull() {
		var option = buildValidOption();
		option.setAdditionalDescription(null);

		assertDoesNotThrow(() -> optionRepository.saveAndFlush(option));
	}

	@Test
	void additionalDescriptionTooLong() {
		var option = buildValidOption();
		option.setAdditionalDescription("a".repeat(101));

		assertThrows(DataIntegrityViolationException.class, () -> optionRepository.saveAndFlush(option));
	}

	@Test
	void priceNull() {
		var option = buildValidOption();
		option.setPrice(null);

		assertThrows(DataIntegrityViolationException.class, () -> optionRepository.saveAndFlush(option));
	}

	@Test
	void priceTooLarge() {
		var option = buildValidOption();
		option.setPrice(BigDecimal.valueOf(1234567.89));

		assertThrows(DataIntegrityViolationException.class, () -> optionRepository.saveAndFlush(option));
	}

	@Test
	void minCountNegative() {
		var option = buildValidOption();
		option.setMinCount(-1);

		assertDoesNotThrow(() -> optionRepository.saveAndFlush(option));
	}

	@Test
	void maxCountNegative() {
		var option = buildValidOption();
		option.setMaxCount(-5);

		assertDoesNotThrow(() -> optionRepository.saveAndFlush(option));
	}
}

