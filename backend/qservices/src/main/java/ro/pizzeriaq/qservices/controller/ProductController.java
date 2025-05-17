package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.TypesenseResponse.TypesenseResponseDto;
import ro.pizzeriaq.qservices.service.ProductService;
import ro.pizzeriaq.qservices.service.TypesenseQueryService;

import java.util.List;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
public class ProductController {

	private final ProductService service;
	private final TypesenseQueryService typesenseQueryService;
	private final AuthenticationInsightsService authenticationInsightsService;


	@GetMapping
	public List<ProductDTO> getProducts() {
		return service.getProducts();
	}


	@GetMapping("{id}")
	public ProductWithOptionsDTO getProduct(@PathVariable int id) {
		return service.getProduct(id);
	}


	@GetMapping("/search")
	public TypesenseResponseDto queryPizza(@RequestParam("q") String query) {
		var accountId = authenticationInsightsService.getAuthenticationId();
		return typesenseQueryService.queryPizza(query, accountId);
	}


	@DeleteMapping("/search")
	public void deleteSearchHistory() {
		var accountId = authenticationInsightsService.getAuthenticationId();
		typesenseQueryService.deleteConversationForAccount(accountId);
	}
}
