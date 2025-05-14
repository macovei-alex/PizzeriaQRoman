package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.entity.*;
import ro.pizzeriaq.qservices.data.repository.*;
import ro.pizzeriaq.qservices.exceptions.PhoneNumberMissingException;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderFullDto;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.mappers.HistoryOrderMinimalMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderService {

	private final HistoryOrderMinimalMapper historyOrderMinimalMapper;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ProductRepository productRepository;
	private final OrderItem_OptionList_OptionRepository orderItemOptionListOptionRepository;
	private final AddressRepository addressRepository;
	private final AccountRepository accountRepository;


	@Transactional(readOnly = true)
	public List<HistoryOrderMinimalDTO> getOrdersHistory(UUID accountId, int page, int pageSize) {
		var orders = orderRepository.findByAccountIdOrderByOrderTimestampDesc(accountId, PageRequest.of(page, pageSize));

		return orders.stream()
				.map(historyOrderMinimalMapper::fromEntity)
				.toList();
	}


	@Transactional(readOnly = true)
	public HistoryOrderFullDto getFullOrder(int orderId) {
		return HistoryOrderFullDto.builder().build();
	}


	@Transactional
	public void placeOrder(PlacedOrderDTO placedOrderDTO, UUID accountId) throws IllegalArgumentException {
		var account = accountRepository.findById(accountId)
				.orElseThrow(() -> new IllegalArgumentException("Account not found for ID:" + accountId));
		if (account.getPhoneNumber() == null || account.getPhoneNumber().isEmpty()) {
			throw new PhoneNumberMissingException(accountId);
		}

		var products = productRepository.findAll();

		Order order = generateOrder(placedOrderDTO, products, account);

		orderRepository.save(order);
		orderItemRepository.saveAll(order.getOrderItems());
		order.getOrderItems().forEach((orderItem) -> orderItemOptionListOptionRepository.saveAll(orderItem.getOptions()));
	}


	private void validateOrder(PlacedOrderDTO placedOrderDTO, List<Product> products, Account account)
			throws IllegalArgumentException {
		if (account.getAddresses().stream()
				.filter(a -> Objects.equals(a.getId(), placedOrderDTO.getAddressId()))
				.findFirst()
				.isEmpty()
		) {
			throw new IllegalArgumentException("Address not found for ID: " + placedOrderDTO.getAddressId());
		}

		for (PlacedOrderDTO.Item orderItem : placedOrderDTO.getItems()) {
			Product product = products.stream()
					.filter(p -> p.getId() == orderItem.getProductId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(
							"Product not found for ID: " + orderItem.getProductId()
					));
			validateOrderItemOptions(orderItem, product);
		}
	}


	private void validateOrderItemOptions(PlacedOrderDTO.Item orderItem, Product product)
			throws IllegalArgumentException {

		List<PlacedOrderDTO.Item.OptionList> itemOptionLists = orderItem.getOptionLists();

		for (PlacedOrderDTO.Item.OptionList itemOptionList : itemOptionLists) {
			OptionList optionList = product.getOptionLists().stream()
					.filter(ol -> ol.getId() == itemOptionList.getOptionListId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(
							"OptionList not found for ID: " + itemOptionList.getOptionListId()
					));

			validateOptionList(itemOptionList, optionList);
		}
	}


	private void validateOptionList(PlacedOrderDTO.Item.OptionList itemOptionList, OptionList optionList)
			throws IllegalArgumentException {

		if (optionList.getMinChoices() > itemOptionList.getOptions().size()
				|| optionList.getMaxChoices() < itemOptionList.getOptions().size()) {
			throw new IllegalArgumentException(String.format(
					"OptionList with ID ( %d ) has too many options." +
							"Expected an option count in the range [ %d, %d ] but got ( %d ) options instead",
					itemOptionList.getOptionListId(),
					optionList.getMinChoices(),
					optionList.getMaxChoices(),
					itemOptionList.getOptions().size()
			));
		}

		for (PlacedOrderDTO.Item.OptionList.Option itemOption : itemOptionList.getOptions()) {
			Option option = optionList.getOptions().stream()
					.filter(o -> o.getId() == itemOption.getOptionId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(
							"Option not found for ID: " + itemOption.getOptionId()
					));

			if (option.getMinCount() > itemOption.getCount()
					|| option.getMaxCount() < itemOption.getCount()) {
				throw new IllegalArgumentException(String.format(
						"Option with ID ( %d ) from OptionList with ID ( %d ) has too big of a count." +
								"Expected a count in the range [ %d, %d ] but got a count of ( %d ) instead",
						option.getId(),
						itemOptionList.getOptionListId(),
						option.getMinCount(),
						option.getMaxCount(),
						itemOption.getCount()
				));
			}
		}
	}


	private Order generateOrder(PlacedOrderDTO placedOrderDTO, List<Product> products, Account account)
			throws IllegalArgumentException {

		validateOrder(placedOrderDTO, products, account);

		var address = addressRepository.findById(placedOrderDTO.getAddressId()).orElseThrow();

		Order order = Order.builder()
				.id(null)
				.account(account)
				.address(address)
				.orderItems(new ArrayList<>())
				.orderStatus(OrderStatus.RECEIVED)
				.estimatedPreparationTime(null)
				.orderTimestamp(LocalDateTime.now())
				.deliveryTimestamp(null)
				.additionalNotes(placedOrderDTO.getAdditionalNotes())
				.totalPrice(BigDecimal.ZERO)
				.totalPriceWithDiscount(BigDecimal.ZERO)
				.build();

		for (PlacedOrderDTO.Item placedOrderItemDTO : placedOrderDTO.getItems()) {
			Product product = products.stream()
					.filter(p -> p.getId() == placedOrderItemDTO.getProductId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(String.format(
							"Product not found for OrderItem with ID ( %d )",
							placedOrderItemDTO.getProductId()
					)));

			OrderItem orderItem = generateOrderItem(placedOrderItemDTO, product);
			orderItem.setOrder(order);

			order.setTotalPrice(order.getTotalPrice().add(orderItem.getTotalPrice()));
			order.setTotalPriceWithDiscount(order.getTotalPriceWithDiscount().add(orderItem.getTotalPriceWithDiscount()));
			order.getOrderItems().add(orderItem);
		}

		return order;
	}


	private OrderItem generateOrderItem(PlacedOrderDTO.Item placedItem, Product product) {
		OrderItem orderItem = OrderItem.builder()
				.id(null)
				.order(null)
				.product(product)
				.options(new ArrayList<>())
				.count(placedItem.getCount())
				.build();

		BigDecimal totalPrice = product.getPrice();

		for (PlacedOrderDTO.Item.OptionList itemOptionList : placedItem.getOptionLists()) {
			OptionList optionList = product.getOptionLists().stream()
					.filter((ol) -> ol.getId() == itemOptionList.getOptionListId())
					.findFirst()
					.orElse(null);

			// Bad OptionList IDs were already sanitized during validation
			assert optionList != null;

			for (PlacedOrderDTO.Item.OptionList.Option itemOption : itemOptionList.getOptions()) {
				Option option = optionList.getOptions().stream()
						.filter((o) -> o.getId() == itemOption.getOptionId())
						.findFirst()
						.orElse(null);

				// Bad Option IDs were already sanitized during validation
				assert option != null;

				totalPrice = totalPrice.add(option.getPrice().multiply(BigDecimal.valueOf(itemOption.getCount())));

				orderItem.getOptions().add(OrderItem_OptionList_Option.builder()
						.id(null)
						.orderItem(orderItem)
						.optionList(optionList)
						.option(option)
						.count(itemOption.getCount())
						.build());
			}
		}

		totalPrice = totalPrice.multiply(BigDecimal.valueOf(placedItem.getCount()));

		orderItem.setTotalPrice(totalPrice);
		orderItem.setTotalPriceWithDiscount(totalPrice);

		return orderItem;
	}

}
