package ro.pizzeriaq.qservices.unit.entities;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.AddressType;
import ro.pizzeriaq.qservices.repositories.AddressTypeRepository;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
@Rollback
public class AddressTypeConstraintsTest {

	@Value("{app.environment}")
	String environment;

	@Autowired
	AddressTypeRepository addressTypeRepository;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL);
		RepositoryTestConfig.addDynamicProperties(registry);
	}


	@BeforeAll
	void setUp() {
		log.info("Environment: {}", environment);
	}


	@Test
	void validAddressType() {
		var type = AddressType.builder().name("a".repeat(30)).build();
		var saved = addressTypeRepository.save(type);

		assertNotNull(saved.getId());
		assertEquals("a".repeat(30), saved.getName());
	}

	@Test
	void nameNull() {
		var type = AddressType.builder().name(null).build();

		assertThrows(DataIntegrityViolationException.class, () -> addressTypeRepository.saveAndFlush(type));
	}

	@Test
	void nameTooLong() {
		var type = AddressType.builder().name("a".repeat(31)).build();

		assertThrows(DataIntegrityViolationException.class, () -> addressTypeRepository.saveAndFlush(type));
	}

	@Test
	void duplicateNames() {
		var first = AddressType.builder().name("new type").build();
		var second = AddressType.builder().name("new type").build();
		addressTypeRepository.saveAndFlush(first);

		assertThrows(DataIntegrityViolationException.class, () -> addressTypeRepository.saveAndFlush(second));
	}
}
