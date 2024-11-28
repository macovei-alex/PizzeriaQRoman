package ro.pizzeriaq.qservices.service.DTO;

import lombok.Data;
import ro.pizzeriaq.qservices.data.model.ProductCategory;

@Data
public class ProductCategoryDTO {

	private long id;
	private String name;

	public static ProductCategoryDTO fromEntity(ProductCategory productCategory) {
		ProductCategoryDTO productCategoryDTO = new ProductCategoryDTO();
		productCategoryDTO.setId(productCategory.getId());
		productCategoryDTO.setName(productCategory.getName());
		return productCategoryDTO;
	}
}
