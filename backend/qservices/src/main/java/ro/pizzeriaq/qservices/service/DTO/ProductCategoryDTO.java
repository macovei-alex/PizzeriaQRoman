package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;
import ro.pizzeriaq.qservices.data.model.ProductCategory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class ProductCategoryDTO {

	private int id;
	private String name;

}
