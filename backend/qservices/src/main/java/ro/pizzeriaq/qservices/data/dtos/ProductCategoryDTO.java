package ro.pizzeriaq.qservices.data.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class ProductCategoryDto {

	private int id;
	private String name;

}
