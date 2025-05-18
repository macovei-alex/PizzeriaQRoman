package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductWithOptionsDTO;
import ro.pizzeriaq.qservices.service.DTO.Typesense.TypesenseConversationResultDto;
import ro.pizzeriaq.qservices.service.DTO.Typesense.TypesenseLookupResponseDto;
import ro.pizzeriaq.qservices.service.ProductService;
import ro.pizzeriaq.qservices.service.TypesenseQueryService;

import javax.naming.ServiceUnavailableException;
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
	public TypesenseLookupResponseDto queryPizza(@RequestParam("q") String query) throws ServiceUnavailableException {
		var accountId = authenticationInsightsService.getAuthenticationId();
		return typesenseQueryService.queryPizza(query, accountId);
	}


	@DeleteMapping("/search")
	public void deleteSearchHistory() {
		var accountId = authenticationInsightsService.getAuthenticationId();
		typesenseQueryService.deleteConversationForAccount(accountId);
	}


	@GetMapping("/search/history")
	public ResponseEntity<TypesenseConversationResultDto> getConversationHistory() throws ServiceUnavailableException {
		var accountId = authenticationInsightsService.getAuthenticationId();
		var history = typesenseQueryService.getConversationHistory(accountId);
		return history.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
	}
}
