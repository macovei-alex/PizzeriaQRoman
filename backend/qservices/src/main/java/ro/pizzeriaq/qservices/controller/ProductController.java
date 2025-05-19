package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
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
