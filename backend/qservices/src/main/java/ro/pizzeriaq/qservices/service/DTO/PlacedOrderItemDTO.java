package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class PlacedOrderItemDTO {

	@Min(value = 1, message = "You cannot order a product with the ID less than or equal to 0")
	private int productId;

	@Min(value = 1, message = "You cannot order an amount of items less than or equal to 0")
	private int count;

}
