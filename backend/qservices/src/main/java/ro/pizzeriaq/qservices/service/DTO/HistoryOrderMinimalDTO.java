package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryOrderMinimalDTO {

	private Integer id;
	private String orderStatus;
	private LocalDateTime orderTimestamp;
	private LocalDateTime deliveryTimestamp;
	private Integer estimatedPreparationTime;
	private String additionalNotes;
	private BigDecimal totalPrice;
	private BigDecimal totalPriceWithDiscount;
	private List<HistoryOrderItemMinimalDTO> items;

}
