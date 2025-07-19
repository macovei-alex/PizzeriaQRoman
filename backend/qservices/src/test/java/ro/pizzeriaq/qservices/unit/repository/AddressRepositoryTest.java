package ro.pizzeriaq.qservices.unit.repository;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.DataJpaTestConfig;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.repositories.AddressRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTestConfig
public class AddressRepositoryTest {

	@Autowired
	AccountRepository accountRepository;
	@Autowired
	AddressRepository addressRepository;
	@Autowired
	EntityInitializerService entityInitializerService;


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


	@Test
	void findAllActiveByAccountId() {
		var accounts = accountRepository.findAllActiveSortByCreatedAt();
		var addresses = addressRepository.findAllActiveByAccountId(accounts.get(0).getId());

		assertEquals(2, addresses.size());
	}

}
