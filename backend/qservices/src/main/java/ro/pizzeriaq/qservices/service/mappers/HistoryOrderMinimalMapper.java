package ro.pizzeriaq.qservices.service.mappers;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Order;
import ro.pizzeriaq.qservices.data.entity.OrderItem;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;

@Component
public class HistoryOrderMinimalMapper {


	public HistoryOrderMinimalDTO fromEntity(@NonNull Order order) {
		return HistoryOrderMinimalDTO.builder()
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


	private HistoryOrderMinimalDTO.Item mapOrderItem(@NonNull OrderItem item) {
		return HistoryOrderMinimalDTO.Item.builder()
				.orderItemId(item.getId())
				.productId(item.getProduct().getId())
				.count(item.getCount())
				.build();
	}
}
