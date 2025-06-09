package ro.pizzeriaq.qservices.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.data.dtos.typesense.TypesenseConversationResultDto;
import ro.pizzeriaq.qservices.data.dtos.typesense.TypesenseLookupResponseDto;
import ro.pizzeriaq.qservices.services.TypesenseQueryService;

import javax.naming.ServiceUnavailableException;
import java.util.UUID;

@RestController
@RequestMapping("/accounts/{accountId}")
@AllArgsConstructor
public class SearchController {

	private final TypesenseQueryService typesenseQueryService;


	@GetMapping("/searches")
	@AccountIdChecked
	public TypesenseLookupResponseDto queryPizza(
			@PathVariable UUID accountId,
			@RequestParam("q") String query
	) throws ServiceUnavailableException {
		return typesenseQueryService.queryPizza(query, accountId);
	}


	@DeleteMapping("/searches")
	@AccountIdChecked
	public void deleteSearchHistory(@PathVariable UUID accountId) {
		typesenseQueryService.deleteConversationForAccount(accountId);
	}


	@GetMapping("/search-history")
	@AccountIdChecked
	public ResponseEntity<TypesenseConversationResultDto> getConversationHistory(
			@PathVariable UUID accountId
	) throws ServiceUnavailableException {
		var history = typesenseQueryService.getConversationHistory(accountId);
		return history.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
	}
}
