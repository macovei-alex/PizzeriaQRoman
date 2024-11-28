package ro.pizzeriaq.qservices.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;

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
		System.out.println(products);
		return products;
	}
}
