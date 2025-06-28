package ro.pizzeriaq.qservices.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.repositories.ProductCategoryRepository;
import ro.pizzeriaq.qservices.data.dtos.ProductCategoryDto;
import ro.pizzeriaq.qservices.services.mappers.ProductCategoryMapper;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductCategoryService {

	private final ProductCategoryRepository productCategoryRepository;
	private final ProductCategoryMapper productCategoryMapper;


	public List<ProductCategoryDto> getCategories() {
		return productCategoryRepository.findAllOrderBySortIdAsc()
				.stream()
				.map(productCategoryMapper::fromEntity)
				.toList();
	}
}
