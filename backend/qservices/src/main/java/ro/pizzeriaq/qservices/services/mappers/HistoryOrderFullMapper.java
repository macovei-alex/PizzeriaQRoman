package ro.pizzeriaq.qservices.services.mappers;

import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.Order;
import ro.pizzeriaq.qservices.data.entities.OrderItem;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderFullDto;

@Component
@AllArgsConstructor
public class HistoryOrderFullMapper {

	private final AddressMapper addressMapper;


	public HistoryOrderFullDto fromEntity(@NonNull Order order) {
		var dto = HistoryOrderFullDto.builder()
				.id(order.getId())
				.orderStatus(order.getOrderStatus().name())
				.orderTimestamp(order.getOrderTimestamp())
				.deliveryTimestamp(order.getDeliveryTimestamp())
				.estimatedPreparationTime(order.getEstimatedPreparationTime())
				.additionalNotes(order.getAdditionalNotes())
				.totalPrice(order.getTotalPrice())
				.totalPriceWithDiscount(order.getTotalPriceWithDiscount())
				.address(addressMapper.fromEntity(order.getAddress()))
				.items(order.getOrderItems().stream().map(this::mapOrderItem).toList())
				.build();

		if (dto.getTotalPrice() == null) {
			throw new NullPointerException("Total price cannot be null");
		}
		if (dto.getTotalPriceWithDiscount() == null) {
			throw new NullPointerException("Total price with discount cannot be null");
		}
		if (dto.getOrderTimestamp() == null) {
			throw new NullPointerException("Order timestamp cannot be null");
		}

		return dto;
	}


	private HistoryOrderFullDto.Item mapOrderItem(@NonNull OrderItem item) {
		return HistoryOrderFullDto.Item.builder()
				.id(item.getId())
				.productId(item.getProduct().getId())
				.options(item.getOptions().stream()
						.map(itemOption -> HistoryOrderFullDto.Item.Option.builder()
								.optionListId(itemOption.getOptionList().getId())
								.optionId(itemOption.getOption().getId())
								.count(itemOption.getCount())
								.build()
						)
						.toList()
				)
				.count(item.getCount())
				.build();
	}

}
