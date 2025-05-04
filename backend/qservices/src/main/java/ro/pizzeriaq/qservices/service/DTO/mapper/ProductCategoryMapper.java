package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.ProductCategory;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;

@Component
public class ProductCategoryMapper {


	public ProductCategoryDTO fromEntity(ProductCategory productCategory) {
		if (productCategory == null) {
			return null;
		}

		return ProductCategoryDTO.builder()
				.id(productCategory.getId())
				.name(productCategory.getName())
				.build();
	}
}
