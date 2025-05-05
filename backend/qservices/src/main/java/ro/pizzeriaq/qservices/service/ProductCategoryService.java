package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.repository.ProductCategoryRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductCategoryMapper;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductCategoryService {

	private final ProductCategoryRepository productRepository;
	private final ProductCategoryMapper productCategoryMapper;


	public List<ProductCategoryDTO> getCategories() {
		return productRepository.findAllOrderBySortIdAsc()
				.stream()
				.map(productCategoryMapper::fromEntity)
				.toList();
	}
}
