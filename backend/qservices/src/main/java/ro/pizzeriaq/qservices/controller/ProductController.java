package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.TypesenseResponse.TypesenseResponseDto;
import ro.pizzeriaq.qservices.service.ProductService;
import ro.pizzeriaq.qservices.service.TypesenseQueryService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
public class ProductController {

	private final ProductService service;
	private final TypesenseQueryService typesenseQueryService;


	@GetMapping
	public List<ProductDTO> getProducts() {
		return service.getProducts();
	}


	@GetMapping("{id}")
	public ProductWithOptionsDTO getProduct(@PathVariable int id) {
		return service.getProduct(id);
	}


	@GetMapping("/search")
	public TypesenseResponseDto queryPizza(
			@RequestParam("q") String query,
			@RequestParam(value = "conversation_id", required = false) UUID conversationId
	) {
		return typesenseQueryService.queryPizza(query, conversationId);
	}
}
