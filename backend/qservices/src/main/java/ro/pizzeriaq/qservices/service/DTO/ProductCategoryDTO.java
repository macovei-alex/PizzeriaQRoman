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

	public static ProductCategoryDTO fromEntity(ProductCategory productCategory) {
		if (productCategory == null) {
			return null;
		}

		ProductCategoryDTO productCategoryDTO = new ProductCategoryDTO();
		productCategoryDTO.setId(productCategory.getId());
		productCategoryDTO.setName(productCategory.getName());
		return productCategoryDTO;
	}
}
