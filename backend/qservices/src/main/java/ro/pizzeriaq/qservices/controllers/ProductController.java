package ro.pizzeriaq.qservices.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.data.dtos.ProductDto;
import ro.pizzeriaq.qservices.data.dtos.ProductWithOptionsDto;
import ro.pizzeriaq.qservices.services.ProductService;

import java.util.List;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
public class ProductController {

	private final ProductService service;


	@GetMapping
	public List<ProductDto> getProducts() {
		return service.getProducts();
	}


	@GetMapping("{id}")
	public ProductWithOptionsDto getProduct(@PathVariable int id) {
		return service.getProduct(id);
	}

}
