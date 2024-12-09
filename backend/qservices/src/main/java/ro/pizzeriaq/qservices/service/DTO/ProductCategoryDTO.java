package ro.pizzeriaq.qservices.service.DTO;

import lombok.Data;
import ro.pizzeriaq.qservices.data.model.ProductCategory;

@Data
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
