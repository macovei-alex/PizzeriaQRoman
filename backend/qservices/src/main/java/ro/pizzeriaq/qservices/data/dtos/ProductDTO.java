package ro.pizzeriaq.qservices.data.dtos;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class ProductDto {

	private int id;
	private String name;
	private String subtitle;
	private String description;
	private BigDecimal price;
	private String imageName;
	private long imageVersion;
	private int categoryId;

}
