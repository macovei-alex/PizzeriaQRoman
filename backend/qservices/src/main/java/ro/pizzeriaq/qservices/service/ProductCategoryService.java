package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.data.repository.ProductCategoryRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;

import java.util.List;

@Service
public class ProductCategoryService {

	private final ProductCategoryRepository productRepository;

	public ProductCategoryService(ProductCategoryRepository productRepository) {
		this.productRepository = productRepository;
	}

	@Transactional
	public List<ProductCategoryDTO> getCategories() {
		List<ProductCategory> productEntities = productRepository.findAllOrderBySortIdAsc();
		return productEntities.stream().map(ProductCategoryDTO::fromEntity).toList();
	}
}
