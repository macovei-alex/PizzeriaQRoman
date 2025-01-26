package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class OrderItemDTO {

	private int productId;
	private int count;

}
