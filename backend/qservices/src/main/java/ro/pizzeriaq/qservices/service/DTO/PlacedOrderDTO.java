package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class PlacedOrderDTO {

	private List<PlacedOrderItemDTO> items;
	private String additionalNotes;

}
