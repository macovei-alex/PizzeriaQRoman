package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductDTOMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductWithOptionsDTOMapper;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

	private final ProductRepository productRepository;

	private final ProductDTOMapper productDTOMapper;

	private final ProductWithOptionsDTOMapper productWithOptionsDTOMapper;


	public ProductService(ProductRepository productRepository,
						  ProductDTOMapper productDTOMapper,
						  ProductWithOptionsDTOMapper productWithOptionsDTOMapper) {
		this.productRepository = productRepository;
		this.productDTOMapper = productDTOMapper;
		this.productWithOptionsDTOMapper = productWithOptionsDTOMapper;
	}


	@Transactional
	public List<ProductDTO> getProducts() {
		List<Product> productEntities = productRepository.findAll();
		return productEntities.stream().map(productDTOMapper::fromEntity).toList();
	}


	@Transactional
	public Optional<ProductWithOptionsDTO> getProduct(int id) {
		var productOptional = productRepository.findById(id);
		return productOptional.map(productWithOptionsDTOMapper::fromEntity);
	}
}
