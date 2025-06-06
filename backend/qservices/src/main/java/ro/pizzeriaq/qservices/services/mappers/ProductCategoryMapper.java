package ro.pizzeriaq.qservices.services.mappers;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.ProductCategory;
import ro.pizzeriaq.qservices.data.dtos.ProductCategoryDto;

@Component
public class ProductCategoryMapper {


	public ProductCategoryDto fromEntity(ProductCategory productCategory) {
		if (productCategory == null) {
			return null;
		}

		return ProductCategoryDto.builder()
				.id(productCategory.getId())
				.name(productCategory.getName())
				.build();
	}
}
