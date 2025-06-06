package ro.pizzeriaq.qservices.services.mappers;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.Order;
import ro.pizzeriaq.qservices.data.entities.OrderItem;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderMinimalDto;

@Component
public class HistoryOrderMinimalMapper {


	public HistoryOrderMinimalDto fromEntity(@NonNull Order order) {
		return HistoryOrderMinimalDto.builder()
				.id(order.getId())
				.orderStatus(order.getOrderStatus().name())
				.orderTimestamp(order.getOrderTimestamp())
				.deliveryTimestamp(order.getDeliveryTimestamp())
				.estimatedPreparationTime(order.getEstimatedPreparationTime())
				.additionalNotes(order.getAdditionalNotes())
				.totalPrice(order.getTotalPrice())
				.totalPriceWithDiscount(order.getTotalPriceWithDiscount())
				.items(order.getOrderItems().stream().map(this::mapOrderItem).toList())
				.build();
	}


	private HistoryOrderMinimalDto.Item mapOrderItem(@NonNull OrderItem item) {
		return HistoryOrderMinimalDto.Item.builder()
				.orderItemId(item.getId())
				.productId(item.getProduct().getId())
				.count(item.getCount())
				.build();
	}
}
