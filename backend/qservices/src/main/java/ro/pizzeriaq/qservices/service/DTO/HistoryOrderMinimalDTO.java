package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
public class HistoryOrderMinimalDTO {

	private int id;
	private String orderStatus;
	private LocalDateTime orderTimestamp;
	private LocalDateTime deliveryTimestamp;
	private Integer estimatedPreparationTime;
	private String additionalNotes;
	private BigDecimal totalPrice;
	private BigDecimal totalPriceWithDiscount;
	private List<Item> items;


	@Builder
	@Data
	public static class Item {
		private int orderItemId;
		private int productId;
		private int count;
	}

}
