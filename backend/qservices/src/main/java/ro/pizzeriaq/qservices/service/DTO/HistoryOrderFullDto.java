package ro.pizzeriaq.qservices.service.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class HistoryOrderFullDto {

	private int id;
	private String orderStatus;
	private LocalDateTime orderTimestamp;
	private LocalDateTime deliveryTimestamp;
	private Integer estimatedPreparationTime;
	private String additionalNotes;
	private BigDecimal totalPrice;
	private BigDecimal totalPriceWithDiscount;
	private AddressDto address;
	private List<Item> items;


	@Builder
	@Data
	public static class Item {

		private int id;
		private int productId;
		private int count;
		List<Option> options;


		@Data
		@Builder
		public static class Option {

			private int optionListId;
			private int optionId;
			private int count;

		}
	}

}
