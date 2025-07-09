package ro.pizzeriaq.qservices.unit.repository;

import jakarta.persistence.EntityManager;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.repositories.OrderRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
public class OrderRepositoryTest {

	@Value("app.environment")
	String environment;

	@Autowired
	OrderRepository orderRepository;
	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	EntityManager entityManager;


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
	void findByAccountIdPageable() {
		var accountIds = accountRepository.findAllActiveSortByCreatedAt().stream()
				.map(Account::getId).toList();

		var ordersAccount0PageOf02 = orderRepository
				.findByAccountIdSortByOrderTimestampDesc(accountIds.get(0), PageRequest.of(0, 2));
		assertEquals(2, ordersAccount0PageOf02.size());

		var ordersAccount0PageOf03 = orderRepository
				.findByAccountIdSortByOrderTimestampDesc(accountIds.get(0), PageRequest.of(0, 3));
		assertEquals(2, ordersAccount0PageOf03.size());

		var ordersAccount1PageOf02 = orderRepository
				.findByAccountIdSortByOrderTimestampDesc(accountIds.get(1), PageRequest.of(0, 2));
		assertEquals(0, ordersAccount1PageOf02.size());
	}

	@Test
	void findByIdWithEntityGraph() {
		var accounts = accountRepository.findAllActiveSortByCreatedAt();
		for (var account : accounts) {
			for (var order : account.getOrders()) {
				entityManager.detach(order);

				var preloadedOrder = orderRepository.findByIdPreload(order.getId(), account.getId()).orElseThrow();

				assertTrue(Hibernate.isInitialized(preloadedOrder.getAccount()));
				assertNull(preloadedOrder.getCoupon());
				assertTrue(Hibernate.isInitialized(preloadedOrder.getOrderItems()));
				assertTrue(Hibernate.isInitialized(preloadedOrder.getAddress()));
				assertTrue(Hibernate.isInitialized(preloadedOrder.getOrderTimestamp()));
			}
		}
	}
}
