package ro.pizzeriaq.qservices.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;
import ro.pizzeriaq.qservices.service.ProductCategoryService;

import java.util.List;

@RestController
@RequestMapping("/category")
public class ProductCategoryController {

	private final ProductCategoryService service;

	public ProductCategoryController(ProductCategoryService service) {
		this.service = service;
	}

	@GetMapping("/all")
	public List<ProductCategoryDTO> getProducts() {
		var categories = service.getCategories();
		return categories;
	}
}
