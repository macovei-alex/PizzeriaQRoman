package ro.pizzeriaq.qservices.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.repository.OptionListRepository;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.mappers.ProductMapper;
import ro.pizzeriaq.qservices.service.mappers.ProductWithOptionsMapper;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductService {

	@PersistenceContext
	private final EntityManager entityManager;

	private final ProductRepository productRepository;
	private final ProductMapper productMapper;
	private final ProductWithOptionsMapper productWithOptionsMapper;
	private final OptionListRepository optionListRepository;


	@Transactional(readOnly = true)
	public List<ProductDTO> getProducts() {
		return productRepository.findAllCategoryPreload()
				.stream()
				.map(productMapper::fromEntity)
				.toList();
	}


	@Transactional(readOnly = true)
	public ProductWithOptionsDTO getProduct(int id) {
		var product = productRepository.findByIdOptionListsPreload(id)
				.orElseThrow(() -> new EntityNotFoundException("Product not found for ID: " + id));

		entityManager.detach(product);

		if (!product.getOptionLists().isEmpty()) {
			var optionLists = optionListRepository.findAllByProductPreloadOptions(product);
			product.setOptionLists(optionLists);
		}

		return productWithOptionsMapper.fromEntity(product);
	}
}
