package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class OptionDTO {

	private int id;
	private String name;
	private String additionalDescription;
	private BigDecimal price;
	private int minCount;
	private int maxCount;

}
