package ro.pizzeriaq.qservices.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.data.dtos.ProductCategoryDto;
import ro.pizzeriaq.qservices.services.ProductCategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
@AllArgsConstructor
public class ProductCategoryController {

	private final ProductCategoryService service;


	@GetMapping
	public List<ProductCategoryDto> getProducts() {
		return service.getCategories();
	}
}
