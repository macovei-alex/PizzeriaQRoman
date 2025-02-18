package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.*;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.data.repository.OrderItemRepository;
import ro.pizzeriaq.qservices.data.repository.OrderRepository;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.HistoryOrderMinimalMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

	private final HistoryOrderMinimalMapper historyOrderMinimalMapper;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ProductRepository productRepository;
	private final AccountRepository accountRepository;


	public OrderService(
			HistoryOrderMinimalMapper historyOrderMinimalMapper,
			OrderRepository orderRepository,
			OrderItemRepository orderItemRepository,
			ProductRepository productRepository,
			AccountRepository accountRepository) {
		this.historyOrderMinimalMapper = historyOrderMinimalMapper;
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.productRepository = productRepository;
		this.accountRepository = accountRepository;
	}


	@Transactional
	public void placeOrder(PlacedOrderDTO placedOrderDTO) throws IllegalArgumentException {
		List<Product> products = productRepository.findAll();
		Account account = accountRepository.findAll().getFirst();

		validateOrder(placedOrderDTO, products);

		Order order = generateOrder(placedOrderDTO, products, account);

		orderRepository.save(order);
		orderItemRepository.saveAll(order.getOrderItems());
	}


	private void validateOrder(PlacedOrderDTO placedOrderDTO, List<Product> products) throws IllegalArgumentException {
		for (PlacedOrderDTO.Item placedOrderItemDTO : placedOrderDTO.getItems()) {
			if (products.stream().noneMatch(p -> p.getId() == placedOrderItemDTO.getProductId())) {
				throw new IllegalArgumentException("Product not found for ID: " + placedOrderItemDTO.getProductId());
			}
		}
	}


	private Order generateOrder(PlacedOrderDTO placedOrderDTO, List<Product> products, Account account) {
		Order order = Order.builder()
				.account(account)
				.orderItems(new ArrayList<>())
				.orderStatus(OrderStatus.RECEIVED)
				.estimatedPreparationTime(null)
				.orderTimestamp(LocalDateTime.now())
				.deliveryTimestamp(null)
				.additionalNotes(placedOrderDTO.getAdditionalNotes())
				.totalPrice(null)
				.totalPriceWithDiscount(null)
				.build();

		for (PlacedOrderDTO.Item placedOrderItemDTO : placedOrderDTO.getItems()) {
			Product product = products.stream()
					.filter(p -> p.getId() == placedOrderItemDTO.getProductId())
					.findFirst().orElseThrow();
			BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(placedOrderItemDTO.getCount()));
			OrderItem orderItem = OrderItem.builder()
					.order(order)
					.product(product)
					.totalPrice(totalPrice)
					.totalPriceWithDiscount(totalPrice)
					.count(placedOrderItemDTO.getCount())
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


	@Transactional(readOnly = true)
	public List<HistoryOrderMinimalDTO> getOrdersHistory() {
		List<Order> orders = orderRepository.findAll();

		return orders.stream()
				.map(historyOrderMinimalMapper::fromEntity)
				.toList();
	}
}
