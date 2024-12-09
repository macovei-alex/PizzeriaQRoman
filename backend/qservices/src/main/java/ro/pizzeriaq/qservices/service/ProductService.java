package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;

import java.util.List;

@Service
public class ProductService {

	private final ProductRepository productRepository;


	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}


	@Transactional
	public List<ProductDTO> getProducts() {
		List<Product> productEntities = productRepository.findAll();
		return productEntities.stream().map(ProductDTO::fromEntity).toList();
	}


	@Transactional
	public ProductWithOptionsDTO getProduct(int id) {
		Product product = productRepository.findById(id).orElse(null);
		return ProductWithOptionsDTO.fromEntity(product);
	}
}
