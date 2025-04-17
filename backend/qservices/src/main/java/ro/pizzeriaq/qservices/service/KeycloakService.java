package ro.pizzeriaq.qservices.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class KeycloakService {

	private final RestClient restClient;
	private final OAuth2AuthorizedClientManager authorizedClientManager;


	public KeycloakService(OAuth2AuthorizedClientManager authorizedClientManager) {
		this.authorizedClientManager = authorizedClientManager;
		this.restClient = RestClient.builder()
				.baseUrl("http://localhost:18080")
				.build();
	}


	private OAuth2AuthorizeRequest createAuthorizeRequest() {
		return OAuth2AuthorizeRequest
				.withClientRegistrationId("keycloak")
				.principal("keycloak-client")
				.build();
	}


	public List<Map<String, Object>> getUsers() {
		var authorizedClient = authorizedClientManager.authorize(createAuthorizeRequest());
		if (authorizedClient == null) {
			throw new RuntimeException("Failed to authorize client");
		}

		return this.restClient.get()
				.uri("/admin/realms/pizzeriaq/users")
				.header(HttpHeaders.AUTHORIZATION, "Bearer " + authorizedClient.getAccessToken().getTokenValue())
				.retrieve()
				.body(new ParameterizedTypeReference<>() {});
	}

}
