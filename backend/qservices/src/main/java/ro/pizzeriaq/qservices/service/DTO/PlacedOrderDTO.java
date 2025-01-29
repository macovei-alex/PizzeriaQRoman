package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class PlacedOrderDTO {

	@NotNull(message = "The list of items in an order cannot be null")
	@Size(min = 1, message = "An order cannot contain 0 or less items")
	private List<PlacedOrderItemDTO> items;

	private String additionalNotes;

}
