package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.*;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.data.repository.OrderItemRepository;
import ro.pizzeriaq.qservices.data.repository.OrderRepository;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.OrderDTO;
import ro.pizzeriaq.qservices.service.DTO.OrderItemDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ProductRepository productRepository;
	private final AccountRepository accountRepository;


	public OrderService(
			OrderRepository orderRepository,
			OrderItemRepository orderItemRepository,
			ProductRepository productRepository,
			AccountRepository accountRepository) {
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.productRepository = productRepository;
		this.accountRepository = accountRepository;
	}


	@Transactional
	public void placeOrder(OrderDTO orderDTO) throws IllegalArgumentException {
		List<Product> products = productRepository.findAll();
		Account account = accountRepository.findAll().getFirst();

		validateOrder(orderDTO, products);

		Order order = generateOrder(orderDTO, products, account);

		orderRepository.save(order);
		orderItemRepository.saveAll(order.getOrderItems());
	}


	private void validateOrder(OrderDTO orderDTO, List<Product> products) throws IllegalArgumentException {
		if (orderDTO == null) {
			throw new IllegalArgumentException("Order cannot be null");
		}

		if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
			throw new IllegalArgumentException("Order must contain at least one item");
		}

		for (OrderItemDTO orderItemDTO : orderDTO.getItems()) {
			if (products.stream().noneMatch(p -> p.getId() == orderItemDTO.getProductId())) {
				throw new IllegalArgumentException("Product not found for ID: " + orderItemDTO.getProductId());
			}
			if (orderItemDTO.getCount() <= 0) {
				throw new IllegalArgumentException("Invalid count for product ID: " + orderItemDTO.getProductId());
			}
		}
	}


	private Order generateOrder(OrderDTO orderDTO, List<Product> products, Account account) {
		Order order = Order.builder()
				.account(account)
				.orderItems(new ArrayList<>())
				.orderStatus(OrderStatus.RECEIVED)
				.estimatedPreparationTime(null)
				.orderTimestamp(LocalDateTime.now())
				.deliveryTimestamp(null)
				.additionalNotes(orderDTO.getAdditionalNotes())
				.totalPrice(null)
				.totalPriceWithDiscount(null)
				.build();

		for (OrderItemDTO orderItemDTO : orderDTO.getItems()) {
			Product product = products.stream().filter(p -> p.getId() == orderItemDTO.getProductId()).findFirst().get();
			BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(orderItemDTO.getCount()));
			OrderItem orderItem = OrderItem.builder()
					.order(order)
					.product(product)
					.totalPrice(totalPrice)
					.totalPriceWithDiscount(totalPrice)
					.count(orderItemDTO.getCount())
					.build();
			order.getOrderItems().add(orderItem);
		}

		order.setTotalPrice(order.getOrderItems().stream()
				.map(orderItem -> orderItem.getProduct().getPrice().multiply(BigDecimal.valueOf(orderItem.getCount())))
				.reduce(BigDecimal.ZERO, BigDecimal::add)
		);

		order.setTotalPriceWithDiscount(order.getTotalPrice());

		return order;
	}
}
