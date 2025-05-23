package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.service.DTO.typesense.TypesenseConversationResultDto;
import ro.pizzeriaq.qservices.service.DTO.typesense.TypesenseLookupResponseDto;
import ro.pizzeriaq.qservices.service.TypesenseQueryService;

import javax.naming.ServiceUnavailableException;
import java.util.UUID;

@RestController
@RequestMapping("/accounts/{accountId}/search")
@AllArgsConstructor
public class SearchController {

	private final TypesenseQueryService typesenseQueryService;


	@GetMapping()
	@AccountIdChecked
	public TypesenseLookupResponseDto queryPizza(
			@PathVariable UUID accountId,
			@RequestParam("q") String query
	) throws ServiceUnavailableException {
		return typesenseQueryService.queryPizza(query, accountId);
	}


	@DeleteMapping()
	@AccountIdChecked
	public void deleteSearchHistory(@PathVariable UUID accountId) {
		typesenseQueryService.deleteConversationForAccount(accountId);
	}


	@GetMapping("/history")
	@AccountIdChecked
	public ResponseEntity<TypesenseConversationResultDto> getConversationHistory(
			@PathVariable UUID accountId
	) throws ServiceUnavailableException {
		var history = typesenseQueryService.getConversationHistory(accountId);
		return history.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
	}
}
