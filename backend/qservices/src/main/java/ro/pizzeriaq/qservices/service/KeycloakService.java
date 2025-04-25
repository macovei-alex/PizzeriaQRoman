package ro.pizzeriaq.qservices.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;

import java.util.List;

@Service
public class KeycloakService {

	private final RestClient restClient;
	private final OAuth2AuthorizedClientManager authorizedClientManager;
	private final String keycloakRealm;


	public KeycloakService(
			OAuth2AuthorizedClientManager authorizedClientManager,
			@Value("${keycloak.base-url}") String keycloakBaseUrl,
			@Value("${keycloak.realm}") String keycloakRealm
	) {
		this.keycloakRealm = keycloakRealm;
		this.authorizedClientManager = authorizedClientManager;
		this.restClient = RestClient.builder()
				.baseUrl(keycloakBaseUrl)
				.build();
	}


	private OAuth2AuthorizeRequest createClientAuthorizeRequest() {
		return OAuth2AuthorizeRequest
				.withClientRegistrationId("keycloak")
				.principal("keycloak-client")
				.build();
	}


	public List<KeycloakUser> getUsers() {
		var authorizedClient = authorizedClientManager.authorize(createClientAuthorizeRequest());
		if (authorizedClient == null) {
			throw new RuntimeException("Failed to authorize client");
		}

		try {
			return this.restClient.get()
					.uri("/admin/realms/%s/users".formatted(keycloakRealm))
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + authorizedClient.getAccessToken().getTokenValue())
					.retrieve()
					.body(new ParameterizedTypeReference<>() {
					});
		} catch (RestClientException ex) {
			throw new KeycloakException("Failed to get users or parse response", ex);
		}
	}

}
