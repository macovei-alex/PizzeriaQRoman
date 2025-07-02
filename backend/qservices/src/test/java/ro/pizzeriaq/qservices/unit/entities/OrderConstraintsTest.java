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
import ro.pizzeriaq.qservices.data.entities.*;
import ro.pizzeriaq.qservices.data.entities.Order;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.repositories.AddressRepository;
import ro.pizzeriaq.qservices.repositories.OrderRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
@Rollback
class OrderConstraintsTest {

	@Value("{app.environment}")
	String environment;

	@Autowired
	OrderRepository orderRepository;
	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private AddressRepository addressRepository;


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


	private Order buildValidOrder() {
		var account = accountRepository.findAllActiveSortByCreatedAt().get(0);
		var address = addressRepository.findAllActiveByAccountId(account.getId()).get(0);

		return Order.builder()
				.account(account)
				.address(address)
				.coupon(null)
				.orderStatus(OrderStatus.RECEIVED)
				.orderTimestamp(LocalDateTime.now())
				.deliveryTimestamp(LocalDateTime.now().plusMinutes(45))
				.estimatedPreparationTime(30)
				.additionalNotes("a".repeat(1000))
				.totalPrice(BigDecimal.valueOf(123456.78))
				.totalPriceWithDiscount(BigDecimal.valueOf(123456.78))
				.build();
	}


	@Test
	void validOrder() {
		var saved = orderRepository.save(buildValidOrder());
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void idNull() {
		var order = buildValidOrder();
		order.setId(null);

		var saved = orderRepository.saveAndFlush(order);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = orderRepository.saveAndFlush(buildValidOrder());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> orderRepository.saveAndFlush(saved));
	}

	@Test
	void accountNull() {
		var order = buildValidOrder();
		order.setAccount(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void addressNull() {
		var order = buildValidOrder();
		order.setAddress(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void couponNull() {
		var order = buildValidOrder();
		order.setCoupon(null);

		assertDoesNotThrow(() -> orderRepository.saveAndFlush(order));
	}

	@Test
	void orderStatusNull() {
		var order = buildValidOrder();
		order.setOrderStatus(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void orderTimestampNull() {
		var order = buildValidOrder();
		order.setOrderTimestamp(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void deliveryTimestampNull() {
		var order = buildValidOrder();
		order.setDeliveryTimestamp(null);

		assertDoesNotThrow(() -> orderRepository.saveAndFlush(order));
	}

	@Test
	void estimatedPrepTimeNull() {
		var order = buildValidOrder();
		order.setEstimatedPreparationTime(null);

		assertDoesNotThrow(() -> orderRepository.saveAndFlush(order));
	}

	@Test
	void additionalNotesNull() {
		var order = buildValidOrder();
		order.setAdditionalNotes(null);

		assertDoesNotThrow(() -> orderRepository.saveAndFlush(order));
	}

	@Test
	void additionalNotesTooLong() {
		var order = buildValidOrder();
		order.setAdditionalNotes("a".repeat(1001));

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void totalPriceNull() {
		var order = buildValidOrder();
		order.setTotalPrice(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void totalPriceTooLarge() {
		var order = buildValidOrder();

		order.setTotalPrice(BigDecimal.valueOf(1234567.89));
		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void totalPriceWithDiscountNull() {
		var order = buildValidOrder();
		order.setTotalPriceWithDiscount(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}

	@Test
	void totalPriceWithDiscountTooLarge() {
		var order = buildValidOrder();

		order.setTotalPriceWithDiscount(BigDecimal.valueOf(1234567.89));
		assertThrows(DataIntegrityViolationException.class, () -> orderRepository.saveAndFlush(order));
	}
}

