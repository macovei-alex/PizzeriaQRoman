package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.data.repository.ProductCategoryRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductCategoryMapper;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductCategoryService {

	private final ProductCategoryRepository productRepository;
	private final ProductCategoryMapper productCategoryMapper;


	@Transactional
	public List<ProductCategoryDTO> getCategories() {
		List<ProductCategory> productEntities = productRepository.findAllOrderBySortIdAsc();
		return productEntities.stream().map(productCategoryMapper::fromEntity).toList();
	}
}
