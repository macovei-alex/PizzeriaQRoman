package ro.pizzeriaq.qservices.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/product")
public class ProductController {

	private final ProductService service;


	public ProductController(ProductService service) {
		this.service = service;
	}


	@GetMapping("/all")
	public List<ProductDTO> getProducts() {
		var products = service.getProducts();
		return products;
	}


	@GetMapping("/{id}")
	public ResponseEntity<?> getProduct(@PathVariable String id) {
		int idInt;
		try {
			idInt = Integer.parseInt(id);
		} catch (NumberFormatException e) {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body("Invalid ID format: " + id);
		}

		Optional<ProductWithOptionsDTO> product = service.getProduct(idInt);
		if (product.isEmpty()) {
			return ResponseEntity
					.status(HttpStatus.NO_CONTENT)
					.body("Product not found for ID: " + idInt);
		}

		return ResponseEntity.ok(product.get());
	}
}
