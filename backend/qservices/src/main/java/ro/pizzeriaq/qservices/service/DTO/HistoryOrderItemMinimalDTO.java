package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryOrderItemMinimalDTO {

	private Integer productId;
	private Integer count;

}
