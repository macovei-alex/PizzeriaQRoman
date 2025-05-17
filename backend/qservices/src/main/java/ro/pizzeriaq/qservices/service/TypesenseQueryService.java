package ro.pizzeriaq.qservices.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import ro.pizzeriaq.qservices.service.DTO.TypesenseResponse.TypesenseResponseDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;

@Service
public class TypesenseQueryService {

	private final RestClient restClient;
	private final String lookupCollectionName;
	private final String conversationModelId;
	private final AccountService accountService;


	public TypesenseQueryService(
			@Value("${typesense.base-url}") String typesenseUrl,
			@Value("${typesense.collections.lookup}") String lookupCollectionName,
			@Value("${typesense.conversation-model-id}") String conversationModelId,
			@Value("${typesense.api-key}") String apiKey,
			AccountService accountService
	) {
		assertNotNull(typesenseUrl, "Typesense URL must not be null");
		assertNotNull(lookupCollectionName, "Typesense collection name must not be null");
		assertNotNull(conversationModelId, "Typesense conversation model ID must not be null");
		assertNotNull(apiKey, "Typesense API key must not be null");

		this.restClient = RestClient.builder()
				.baseUrl(typesenseUrl)
				.defaultHeaders((headers) -> headers.add("x-typesense-api-key", apiKey))
				.build();
		this.lookupCollectionName = lookupCollectionName;
		this.conversationModelId = conversationModelId;
		this.accountService = accountService;
	}


	public TypesenseResponseDto queryPizza(@NonNull String naturalLanguageQuery, @NonNull UUID accountId) {
		var conversationId = accountService.getConversationId(accountId);
		var response = executeQuery(naturalLanguageQuery, conversationId);
		if (!response.getConversation().getConversationId().equals(conversationId)) {
			accountService.setConversationId(accountId, response.getConversation().getConversationId());
		}
		return response;
	}


	private TypesenseResponseDto executeQuery(@NonNull String naturalLanguageQuery, @Nullable UUID conversationId) {
		var uri = UriComponentsBuilder
				.fromUriString("/multi_search")
				.queryParam("q", naturalLanguageQuery)
				.queryParam("conversation", true)
				.queryParam("conversation_model_id", conversationModelId);

		if (conversationId != null) {
			uri.queryParam("conversation_id", conversationId);
		}

		return restClient.post()
				.uri(uri.build().toUriString())
				.body(Map.of(
						"searches", List.of(Map.of(
								"collection", lookupCollectionName,
								"query_by", "embedding",
								"exclude_fields", "externId",
								"sort_by", "_text_match:desc"
						))
				))
				.retrieve()
				.body(TypesenseResponseDto.class);
	}


	public void deleteConversationForAccount(@NonNull UUID accountId) {
		var conversationId = accountService.getConversationId(accountId);
		if (conversationId == null) {
			return;
		}

		accountService.setConversationId(accountId, null);
	}

}
