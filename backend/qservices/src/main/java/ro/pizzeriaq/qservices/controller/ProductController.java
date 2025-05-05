package ro.pizzeriaq.qservices.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
public class ProductController {

	private final ProductService service;


	@GetMapping
	public List<ProductDTO> getProducts() {
		return service.getProducts();
	}


	@GetMapping("{id}")
	public ProductWithOptionsDTO getProduct(@PathVariable int id) {
		return service.getProduct(id);
	}
}
