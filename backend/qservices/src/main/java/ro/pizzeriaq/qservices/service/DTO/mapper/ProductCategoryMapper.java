package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;

@Service
public class ProductCategoryMapper {


	public ProductCategoryDTO fromEntity(ProductCategory productCategory) {
		if (productCategory == null) {
			return null;
		}

		ProductCategoryDTO productCategoryDTO = new ProductCategoryDTO();
		productCategoryDTO.setId(productCategory.getId());
		productCategoryDTO.setName(productCategory.getName());
		return productCategoryDTO;
	}
}
