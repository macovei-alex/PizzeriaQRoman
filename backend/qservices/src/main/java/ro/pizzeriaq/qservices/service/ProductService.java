package ro.pizzeriaq.qservices.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.repository.OptionListRepository;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.ProductWithOptionsMapper;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductService {

	@PersistenceContext
	private final EntityManager entityManager;

	private final ProductRepository productRepository;
	private final ProductMapper productMapper;
	private final ProductWithOptionsMapper productWithOptionsMapper;
	private final OptionListRepository optionListRepository;


	@Transactional
	public List<ProductDTO> getProducts() {
		List<Product> productEntities = productRepository.findAllCategoryPreload();
		return productEntities.stream().map(productMapper::fromEntity).toList();
	}


	@Transactional
	public Optional<ProductWithOptionsDTO> getProduct(int id) {
		var productOptional = productRepository.findByIdOptionListsPreload(id);
		if (productOptional.isEmpty()) {
			return Optional.empty();
		}

		var product = productOptional.get();
		entityManager.detach(product);

		if (!product.getOptionLists().isEmpty()) {
			var optionLists = optionListRepository.findAllByProductPreloadOptions(product);
			product.setOptionLists(optionLists);
		}

		return Optional.of(productWithOptionsMapper.fromEntity(product));
	}
}
