package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductWithOptionsMapper;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

	private final ProductRepository productRepository;
	private final ProductMapper productMapper;
	private final ProductWithOptionsMapper productWithOptionsMapper;


	public ProductService(ProductRepository productRepository,
						  ProductMapper productMapper,
						  ProductWithOptionsMapper productWithOptionsMapper) {
		this.productRepository = productRepository;
		this.productMapper = productMapper;
		this.productWithOptionsMapper = productWithOptionsMapper;
	}


	@Transactional
	public List<ProductDTO> getProducts() {
		List<Product> productEntities = productRepository.findAllCategoryPreload();
		return productEntities.stream().map(productMapper::fromEntity).toList();
	}


	@Transactional
	public Optional<ProductWithOptionsDTO> getProduct(int id) {
		var productOptional = productRepository.findByIdFullPreload(id);
		return productOptional.map(productWithOptionsMapper::fromEntity);
	}
}
