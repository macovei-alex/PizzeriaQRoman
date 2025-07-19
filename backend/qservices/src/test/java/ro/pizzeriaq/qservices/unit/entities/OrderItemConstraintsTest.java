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
import ro.pizzeriaq.qservices.data.entities.Order;
import ro.pizzeriaq.qservices.data.entities.OrderItem;
import ro.pizzeriaq.qservices.data.entities.Product;
import ro.pizzeriaq.qservices.repositories.OrderItemRepository;
import ro.pizzeriaq.qservices.repositories.OrderRepository;
import ro.pizzeriaq.qservices.repositories.ProductRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTestConfig
public class OrderItemConstraintsTest {

	@Value("${app.environment}")
	String environment;

	@Autowired
	OrderItemRepository orderItemRepository;
	@Autowired
	ProductRepository productRepository;
	@Autowired
	OrderRepository orderRepository;
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


	private OrderItem buildValidOrderItem() {
		Order order = orderRepository.findAll().get(0);
		Product product = productRepository.findAllActive().get(0);

		return OrderItem.builder()
				.order(order)
				.product(product)
				.totalPrice(BigDecimal.valueOf(123456.78))
				.totalPriceWithDiscount(BigDecimal.valueOf(123456.78))
				.count(2)
				.build();
	}


	@Test
	void validOrderItem() {
		var saved = orderItemRepository.save(buildValidOrderItem());
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void idNull() {
		var orderItem = buildValidOrderItem();
		orderItem.setId(null);

		var saved = orderItemRepository.saveAndFlush(orderItem);
		assertNotNull(saved.getId());
	}

	@Test
	void updateId() {
		var saved = orderItemRepository.saveAndFlush(buildValidOrderItem());
		saved.setId(saved.getId() + 1);

		assertThrows(JpaSystemException.class, () -> orderItemRepository.saveAndFlush(saved));
	}

	@Test
	void orderNull() {
		var orderItem = buildValidOrderItem();
		orderItem.setOrder(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderItemRepository.saveAndFlush(orderItem));
	}

	@Test
	void productNull() {
		var orderItem = buildValidOrderItem();
		orderItem.setProduct(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderItemRepository.saveAndFlush(orderItem));
	}

	@Test
	void totalPriceNull() {
		var orderItem = buildValidOrderItem();
		orderItem.setTotalPrice(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderItemRepository.saveAndFlush(orderItem));
	}

	@Test
	void totalPriceTooLarge() {
		var orderItem = buildValidOrderItem();
		orderItem.setTotalPrice(BigDecimal.valueOf(1234567.89)); // exceeds 8 digits

		assertThrows(DataIntegrityViolationException.class, () -> orderItemRepository.saveAndFlush(orderItem));
	}

	@Test
	void totalPriceWithDiscountNull() {
		var orderItem = buildValidOrderItem();
		orderItem.setTotalPriceWithDiscount(null);

		assertThrows(DataIntegrityViolationException.class, () -> orderItemRepository.saveAndFlush(orderItem));
	}

	@Test
	void totalPriceWithDiscountTooLarge() {
		var orderItem = buildValidOrderItem();
		orderItem.setTotalPriceWithDiscount(BigDecimal.valueOf(1234567.89));

		assertThrows(DataIntegrityViolationException.class, () -> orderItemRepository.saveAndFlush(orderItem));
	}

	@Test
	void countNegative() {
		var orderItem = buildValidOrderItem();
		orderItem.setCount(-1);

		assertDoesNotThrow(() -> orderItemRepository.saveAndFlush(orderItem));
	}
}
