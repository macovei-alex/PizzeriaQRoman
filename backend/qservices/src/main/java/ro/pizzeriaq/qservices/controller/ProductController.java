package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
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
@AllArgsConstructor
public class ProductController {

	private final ProductService service;


	@GetMapping("/all")
	public List<ProductDTO> getProducts() {
		return service.getProducts();
	}


	@GetMapping("/{id}")
	public ResponseEntity<ProductWithOptionsDTO> getProduct(@PathVariable int id) {
		Optional<ProductWithOptionsDTO> product = service.getProduct(id);
		return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NO_CONTENT).build());
	}
}
