package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class PlacedOrderItemDTO {

	private Integer productId;
	private Integer count;

}
