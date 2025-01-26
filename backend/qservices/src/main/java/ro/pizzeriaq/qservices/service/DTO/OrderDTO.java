package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class OrderDTO {

	private List<OrderItemDTO> items;
	private String additionalNotes;

}
