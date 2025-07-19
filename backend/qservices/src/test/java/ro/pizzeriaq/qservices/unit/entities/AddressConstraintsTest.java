package ro.pizzeriaq.qservices.unit.entities;

import lombok.extern.slf4j.Slf4j;
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
import ro.pizzeriaq.qservices.data.entities.Address;
import ro.pizzeriaq.qservices.data.entities.AddressType;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.repositories.AddressRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTestConfig
public class AddressConstraintsTest {

	@Value("{app.environment}")
	String environment;

	@Autowired
	AddressRepository addressRepository;
	@Autowired
	AccountRepository accountRepository;
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


	private Address buildValidAddress() {
		var account = accountRepository.findAllActiveSortByCreatedAt().get(0);

		return Address.builder()
				.account(account)
				.addressType(AddressType.HOME)
				.addressString("123 Main St")
				.isPrimary(true)
				.isActive(true)
				.build();
	}


	@Test
	void validAddress() {
		var saved = addressRepository.save(buildValidAddress());
		assertNotNull(saved);
		assertNotNull(saved.getId());
		assertTrue(saved.isActive());
	}

	@Test
	void idNull() {
		var address = buildValidAddress();
		address.setId(null);

		var saved = addressRepository.save(address);
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = addressRepository.save(buildValidAddress());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> addressRepository.saveAndFlush(saved));
	}

	@Test
	void accountNull() {
		var address = buildValidAddress();
		address.setAccount(null);

		assertThrows(DataIntegrityViolationException.class, () -> addressRepository.saveAndFlush(address));
	}

	@Test
	void addressTypeNull() {
		Address address = buildValidAddress();
		address.setAddressType(null);

		assertThrows(DataIntegrityViolationException.class, () -> addressRepository.saveAndFlush(address));
	}

	@Test
	void addressStringNull() {
		var address = buildValidAddress();
		address.setAddressString(null);

		assertThrows(DataIntegrityViolationException.class, () -> addressRepository.saveAndFlush(address));
	}

	@Test
	void isActiveDefaultTrue() {
		var account = accountRepository.findAllActiveSortByCreatedAt().get(0);

		Address address = Address.builder()
				.account(account)
				.addressType(AddressType.WORK)
				.addressString("456 Secondary St")
				.isPrimary(false)
				.build();

		var saved = addressRepository.save(address);
		assertTrue(saved.isActive());
	}

}