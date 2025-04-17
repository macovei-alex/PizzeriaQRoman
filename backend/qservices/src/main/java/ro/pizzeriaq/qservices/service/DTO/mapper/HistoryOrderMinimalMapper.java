package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.entity.Order;
import ro.pizzeriaq.qservices.data.entity.OrderItem;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;

@Service
public class HistoryOrderMinimalMapper {


	public HistoryOrderMinimalDTO fromEntity(Order order) {
		if (order == null) {
			return null;
		}

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


	private HistoryOrderMinimalDTO.Item mapOrderItem(OrderItem item) {
		assert item != null;

		return HistoryOrderMinimalDTO.Item.builder()
				.productId(item.getProduct().getId())
				.count(item.getCount())
				.build();
	}
}
