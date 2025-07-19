package ro.pizzeriaq.qservices.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.entities.*;
import ro.pizzeriaq.qservices.exceptions.PhoneNumberMissingException;
import ro.pizzeriaq.qservices.exceptions.PriceNotMatchingException;
import ro.pizzeriaq.qservices.repositories.*;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderFullDto;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderMinimalDto;
import ro.pizzeriaq.qservices.data.dtos.PlaceOrderDto;
import ro.pizzeriaq.qservices.services.mappers.HistoryOrderFullMapper;
import ro.pizzeriaq.qservices.services.mappers.HistoryOrderMinimalMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class OrderService {

	private final HistoryOrderMinimalMapper historyOrderMinimalMapper;
	private final HistoryOrderFullMapper historyOrderFullMapper;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ProductRepository productRepository;
	private final OrderItem_OptionList_OptionRepository orderItemOptionListOptionRepository;
	private final AddressRepository addressRepository;
	private final AccountRepository accountRepository;


	@Transactional(readOnly = true)
	public List<HistoryOrderMinimalDto> getOrdersHistory(UUID accountId, int page, int pageSize) {
		var orders = orderRepository.findByAccountIdSortByOrderTimestampDesc(accountId, PageRequest.of(page, pageSize));

		return orders.stream()
				.map(historyOrderMinimalMapper::fromEntity)
				.toList();
	}


	@Transactional(readOnly = true)
	public HistoryOrderFullDto getFullOrder(int orderId, UUID accountId) {
		var order = orderRepository.findByIdPreload(orderId, accountId)
				.orElseThrow(() -> new EntityNotFoundException("Order not found for ID: " + orderId));
		return historyOrderFullMapper.fromEntity(order);
	}


	@Transactional
	public void placeOrder(PlaceOrderDto placeOrderDTO, UUID accountId) throws IllegalArgumentException {
		var account = accountRepository.findActiveById(accountId)
				.orElseThrow(() -> new IllegalArgumentException("Account not found for ID:" + accountId));
		if (account.getPhoneNumber() == null || account.getPhoneNumber().isEmpty()) {
			throw new PhoneNumberMissingException(accountId);
		}

		var products = productRepository.findAllActive();

		validateOrder(placeOrderDTO, products, account);
		Order order = generateOrder(placeOrderDTO, products, account);

		var priceDifference = order.getTotalPriceWithDiscount().subtract(placeOrderDTO.clientExpectedPrice());
		if (priceDifference.abs().doubleValue() >= 0.01) {
			throw new PriceNotMatchingException(
					"The client expected price does not match the calculated total price. ",
					placeOrderDTO.clientExpectedPrice(),
					order.getTotalPriceWithDiscount()
			);
		} else if (!order.getTotalPriceWithDiscount().equals(placeOrderDTO.clientExpectedPrice())) {
			log.warn("The client expected price does not match the calculated total price, but the difference is small. " +
					"Client expected: {}, Calculated: {}. Difference: {}",
					placeOrderDTO.clientExpectedPrice(),
					order.getTotalPriceWithDiscount(),
					priceDifference
			);
		}

		orderRepository.save(order);
		orderItemRepository.saveAll(order.getOrderItems());
		order.getOrderItems().forEach((orderItem) -> orderItemOptionListOptionRepository.saveAll(orderItem.getOptions()));
	}


	private void validateOrder(PlaceOrderDto placeOrderDTO, List<Product> products, Account account) {
		if (account.getAddresses().stream()
				.filter(a -> Objects.equals(a.getId(), placeOrderDTO.addressId()))
				.findFirst()
				.isEmpty()
		) {
			throw new IllegalArgumentException("Address not found for ID: " + placeOrderDTO.additionalNotes());
		}

		for (PlaceOrderDto.Item orderItem : placeOrderDTO.items()) {
			Product product = products.stream()
					.filter(p -> p.getId() == orderItem.productId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(
							"Product not found for ID: " + orderItem.productId()
					));
			validateOrderItemOptions(orderItem, product);
		}
	}


	private void validateOrderItemOptions(PlaceOrderDto.Item orderItem, Product product) {

		List<PlaceOrderDto.Item.OptionList> itemOptionLists = orderItem.optionLists();

		for (PlaceOrderDto.Item.OptionList itemOptionList : itemOptionLists) {
			OptionList optionList = product.getOptionLists().stream()
					.filter(ol -> ol.getId() == itemOptionList.optionListId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(
							"OptionList not found for ID: " + itemOptionList.optionListId()
					));

			validateOptionList(itemOptionList, optionList);
		}
	}


	private void validateOptionList(PlaceOrderDto.Item.OptionList itemOptionList, OptionList optionList) {

		if (optionList.getMinChoices() > itemOptionList.options().size()
				|| optionList.getMaxChoices() < itemOptionList.options().size()) {
			throw new IllegalArgumentException(String.format(
					"OptionList with ID ( %d ) has too many options." +
							"Expected an option count in the range [ %d, %d ] but got ( %d ) options instead",
					itemOptionList.optionListId(),
					optionList.getMinChoices(),
					optionList.getMaxChoices(),
					itemOptionList.options().size()
			));
		}

		for (PlaceOrderDto.Item.OptionList.Option itemOption : itemOptionList.options()) {
			Option option = optionList.getOptions().stream()
					.filter(o -> o.getId() == itemOption.optionId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(
							"Option not found for ID: " + itemOption.optionId()
					));

			if (option.getMinCount() > itemOption.count()
					|| option.getMaxCount() < itemOption.count()) {
				throw new IllegalArgumentException(String.format(
						"Option with ID ( %d ) from OptionList with ID ( %d ) has too big of a count." +
								"Expected a count in the range [ %d, %d ] but got a count of ( %d ) instead",
						option.getId(),
						itemOptionList.optionListId(),
						option.getMinCount(),
						option.getMaxCount(),
						itemOption.count()
				));
			}
		}
	}


	private Order generateOrder(PlaceOrderDto placeOrderDTO, List<Product> products, Account account) {
		var address = addressRepository.findById(placeOrderDTO.addressId()).orElseThrow();

		Order order = Order.builder()
				.id(null)
				.account(account)
				.address(address)
				.orderItems(new ArrayList<>())
				.orderStatus(OrderStatus.RECEIVED)
				.estimatedPreparationTime(null)
				.orderTimestamp(LocalDateTime.now())
				.deliveryTimestamp(null)
				.additionalNotes(placeOrderDTO.additionalNotes())
				.totalPrice(BigDecimal.ZERO)
				.totalPriceWithDiscount(BigDecimal.ZERO)
				.build();

		for (PlaceOrderDto.Item placedOrderItemDTO : placeOrderDTO.items()) {
			Product product = products.stream()
					.filter(p -> p.getId() == placedOrderItemDTO.productId())
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException(String.format(
							"Product not found for OrderItem with ID ( %d )",
							placedOrderItemDTO.productId()
					)));

			OrderItem orderItem = generateOrderItem(placedOrderItemDTO, product);
			orderItem.setOrder(order);

			order.setTotalPrice(order.getTotalPrice().add(orderItem.getTotalPrice()));
			order.setTotalPriceWithDiscount(order.getTotalPriceWithDiscount().add(orderItem.getTotalPriceWithDiscount()));
			order.getOrderItems().add(orderItem);
		}

		return order;
	}


	private OrderItem generateOrderItem(PlaceOrderDto.Item placedItem, Product product) {
		OrderItem orderItem = OrderItem.builder()
				.id(null)
				.order(null)
				.product(product)
				.options(new ArrayList<>())
				.count(placedItem.count())
				.build();

		BigDecimal totalPrice = product.getPrice();

		for (PlaceOrderDto.Item.OptionList itemOptionList : placedItem.optionLists()) {
			OptionList optionList = product.getOptionLists().stream()
					.filter((ol) -> ol.getId() == itemOptionList.optionListId())
					.findFirst()
					.orElse(null);

			// Bad OptionList IDs were already sanitized during validation
			assert optionList != null;

			for (PlaceOrderDto.Item.OptionList.Option itemOption : itemOptionList.options()) {
				Option option = optionList.getOptions().stream()
						.filter((o) -> o.getId() == itemOption.optionId())
						.findFirst()
						.orElse(null);

				// Bad Option IDs were already sanitized during validation
				assert option != null;

				totalPrice = totalPrice.add(option.getPrice().multiply(BigDecimal.valueOf(itemOption.count())));

				orderItem.getOptions().add(OrderItem_OptionList_Option.builder()
						.id(null)
						.orderItem(orderItem)
						.optionList(optionList)
						.option(option)
						.count(itemOption.count())
						.build());
			}
		}

		totalPrice = totalPrice.multiply(BigDecimal.valueOf(placedItem.count()));

		orderItem.setTotalPrice(totalPrice);
		orderItem.setTotalPriceWithDiscount(totalPrice);

		return orderItem;
	}

}
