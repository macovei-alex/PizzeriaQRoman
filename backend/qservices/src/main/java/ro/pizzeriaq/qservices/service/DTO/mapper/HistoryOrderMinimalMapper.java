package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Order;
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
				.build();
	}
}
