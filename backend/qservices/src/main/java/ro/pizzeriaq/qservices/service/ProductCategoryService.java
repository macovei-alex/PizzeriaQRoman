package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.data.repository.ProductCategoryRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductCategoryMapper;

import java.util.List;

@Service
public class ProductCategoryService {

	private final ProductCategoryRepository productRepository;
	private final ProductCategoryMapper productCategoryMapper;


	public ProductCategoryService(
			ProductCategoryRepository productRepository,
			ProductCategoryMapper productCategoryMapper) {
		this.productRepository = productRepository;
		this.productCategoryMapper = productCategoryMapper;
	}


	@Transactional
	public List<ProductCategoryDTO> getCategories() {
		List<ProductCategory> productEntities = productRepository.findAllOrderBySortIdAsc();
		return productEntities.stream().map(productCategoryMapper::fromEntity).toList();
	}
}
