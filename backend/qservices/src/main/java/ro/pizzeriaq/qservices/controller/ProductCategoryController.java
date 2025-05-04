package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ProductCategoryDTO;
import ro.pizzeriaq.qservices.service.ProductCategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
@AllArgsConstructor
public class ProductCategoryController {

	private final ProductCategoryService service;


	@GetMapping
	public List<ProductCategoryDTO> getProducts() {
		return service.getCategories();
	}
}
