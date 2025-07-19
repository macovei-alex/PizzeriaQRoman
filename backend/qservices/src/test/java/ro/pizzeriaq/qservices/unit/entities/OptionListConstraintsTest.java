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
import ro.pizzeriaq.qservices.data.entities.OptionList;
import ro.pizzeriaq.qservices.repositories.OptionListRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTestConfig
class OptionListConstraintsTest {

	@Value("{app.environment}")
	String environment;

	@Autowired
	OptionListRepository optionListRepository;
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


	private OptionList buildValidOptionList() {
		return OptionList.builder()
				.text("a".repeat(80))
				.minChoices(0)
				.maxChoices(3)
				.build();
	}


	@Test
	void validOptionList() {
		var saved = optionListRepository.save(buildValidOptionList());
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void idNull() {
		var optionList = buildValidOptionList();
		optionList.setId(null);

		var saved = optionListRepository.saveAndFlush(optionList);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = optionListRepository.saveAndFlush(buildValidOptionList());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> optionListRepository.saveAndFlush(saved));
	}

	@Test
	void textNull() {
		var optionList = buildValidOptionList();
		optionList.setText(null);

		assertThrows(DataIntegrityViolationException.class, () -> optionListRepository.saveAndFlush(optionList));
	}

	@Test
	void textTooLong() {
		var optionList = buildValidOptionList();
		optionList.setText("a".repeat(81));

		assertThrows(DataIntegrityViolationException.class, () -> optionListRepository.saveAndFlush(optionList));
	}

	@Test
	void minChoicesNegative() {
		var optionList = buildValidOptionList();
		optionList.setMinChoices(-1);

		assertDoesNotThrow(() -> optionListRepository.saveAndFlush(optionList));
	}

	@Test
	void maxChoicesNegative() {
		var optionList = buildValidOptionList();
		optionList.setMaxChoices(-2);

		assertDoesNotThrow(() -> optionListRepository.saveAndFlush(optionList));
	}

	@Test
	void isActiveDefaultTrue() {
		var optionList = OptionList.builder()
				.text("")
				.minChoices(0)
				.maxChoices(1)
				.build();

		var saved = optionListRepository.saveAndFlush(optionList);
		assertTrue(saved.isActive());
	}
}

