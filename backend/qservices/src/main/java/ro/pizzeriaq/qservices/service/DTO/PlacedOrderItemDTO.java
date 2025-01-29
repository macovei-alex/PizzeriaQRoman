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

	@Min(value = 1, message = "You cannot order a product with the ID equal to 0")
	private int productId;

	@Min(value = 1, message = "You cannot order cannot contain 0 or less items of a kind")
	private int count;

}
