package ro.pizzeriaq.qservices.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import ro.pizzeriaq.qservices.exceptions.TypesenseException;
import ro.pizzeriaq.qservices.data.dtos.typesense.TypesenseConversationResultDto;
import ro.pizzeriaq.qservices.data.dtos.typesense.TypesenseLookupResponseDto;

import javax.naming.ServiceUnavailableException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;

@Service
public class TypesenseQueryService {

	private final RestClient restClient;
	private final String lookupCollectionName;
	private final String conversationsCollectionName;
	private final String conversationModelId;
	private final AccountService accountService;


	public TypesenseQueryService(
			@Value("${typesense.base-url}") String typesenseUrl,
			@Value("${typesense.collections.lookup}") String lookupCollectionName,
			@Value("${typesense.collections.conversations}") String conversationsCollectionName,
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
		this.conversationsCollectionName = conversationsCollectionName;
		this.conversationModelId = conversationModelId;
		this.accountService = accountService;
	}


	public Optional<TypesenseConversationResultDto> getConversationHistory(
			@NonNull UUID accountId
	) throws ServiceUnavailableException {

		var conversationId = accountService.getConversationId(accountId);
		if (conversationId == null) {
			return Optional.empty();
		}

		var uri = UriComponentsBuilder
				.fromUriString("/collections")
				.pathSegment(conversationsCollectionName, "documents", "search")
				.queryParam("q", "*")
				.queryParam("query_by", "conversation_id")
				.queryParam("sort_by", "timestamp:desc")
				.queryParam("per_page", "20")
				.toUriString();

		try {
			return Optional.ofNullable(restClient
					.get()
					.uri(uri + "&filter_by=conversation_id:=" + conversationId)
					.retrieve()
					.body(TypesenseConversationResultDto.class)
			);
		} catch (HttpStatusCodeException e) {
			if (e.getStatusCode().is5xxServerError()) {
				throw new ServiceUnavailableException("Typesense is unavailable");
			}
			return Optional.empty();
		}
	}


	public TypesenseLookupResponseDto queryPizza(
			@NonNull String naturalLanguageQuery,
			@NonNull UUID accountId
	) throws ServiceUnavailableException {
		TypesenseException lastException = null;
		for (int attempt = 0; attempt < 2; ++attempt) {
			try {
				var conversationId = accountService.getConversationId(accountId);
				var response = executeQuery(naturalLanguageQuery, conversationId);
				if (!response.getConversation().getConversationId().equals(conversationId)) {
					accountService.setConversationId(accountId, response.getConversation().getConversationId());
				}
				return response;

			} catch (TypesenseException e) {
				if (e.getCause() instanceof HttpStatusCodeException inner) {
					if (inner.getStatusCode().value() == 400) {
						// query or conversation id error
						accountService.setConversationId(accountId, null);
						lastException = e;
					}
					else if (inner.getStatusCode().value() == 404) {
						// collection not found
						throw e;
					} else if (inner.getStatusCode().is5xxServerError()) {
						// server error
						throw new ServiceUnavailableException("Typesense service is not responding");
					}
				} else {
					// any other error
					throw e;
				}
			}
		}

		throw new TypesenseException("Failed to query Typesense after multiple attempts", lastException);
	}


	private TypesenseLookupResponseDto executeQuery(
			@NonNull String naturalLanguageQuery,
			@Nullable UUID conversationId
	) throws ServiceUnavailableException {

		var uri = UriComponentsBuilder
				.fromUriString("/multi_search")
				.queryParam("q", naturalLanguageQuery)
				.queryParam("conversation", true)
				.queryParam("conversation_model_id", conversationModelId);

		if (conversationId != null) {
			uri.queryParam("conversation_id", conversationId);
		}

		try {

			return restClient
					.post()
					.uri(uri.build().toUriString())
					.body(Map.of(
							"searches", List.of(Map.of(
									"collection", lookupCollectionName,
									"query_by", "embedding",
									"exclude_fields", "embedding",
									"sort_by", "_text_match:desc",
									"per_page", 3
							))
					))
					.retrieve()
					.body(TypesenseLookupResponseDto.class);

		} catch (HttpStatusCodeException e) {
			if (e.getStatusCode().is5xxServerError()) {
				throw new ServiceUnavailableException("Typesense is unavailable");
			}
			throw new TypesenseException("Something went wrong", e);
		}
	}


	public void deleteConversationForAccount(@NonNull UUID accountId) {
		var conversationId = accountService.getConversationId(accountId);
		if (conversationId == null) {
			return;
		}
		accountService.setConversationId(accountId, null);
	}

}
