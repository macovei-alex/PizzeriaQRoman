package ro.pizzeriaq.qservices.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;
import ro.pizzeriaq.qservices.service.DTO.AccountDto;
import ro.pizzeriaq.qservices.service.mappers.AccountMapper;

import javax.naming.ServiceUnavailableException;
import java.util.List;
import java.util.UUID;

@Service
public class KeycloakService {

	private final AccountMapper accountMapper;
	private final RestClient restClient;
	private final OAuth2AuthorizedClientManager authorizedClientManager;
	private final String keycloakRealm;


	public KeycloakService(
			AccountMapper accountMapper,
			OAuth2AuthorizedClientManager authorizedClientManager,
			@Value("${keycloak.base-url}") String keycloakBaseUrl,
			@Value("${keycloak.realm}") String keycloakRealm
	) {
		this.accountMapper = accountMapper;
		this.keycloakRealm = keycloakRealm;
		this.authorizedClientManager = authorizedClientManager;
		this.restClient = RestClient.builder()
				.baseUrl(keycloakBaseUrl)
				.build();
	}


	public List<KeycloakUser> getUsers() throws ServiceUnavailableException {
		var accessToken = generateAccessToken();
		try {
			return restClient
					.get()
					.uri("/admin/realms/%s/users".formatted(keycloakRealm))
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
					.retrieve()
					.body(new ParameterizedTypeReference<>() {
					});
		} catch (HttpStatusCodeException e) {
			if (e.getStatusCode().is5xxServerError()) {
				throw new ServiceUnavailableException("Keycloak service is unavailable");
			}
			throw new KeycloakException("Failed to get users or parse response", e);
		}
	}


	public KeycloakUser getUser(UUID id) throws ServiceUnavailableException {
		var accessToken = generateAccessToken();
		try {
			return restClient
					.get()
					.uri("/admin/realms/%s/users/%s".formatted(keycloakRealm, id))
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
					.retrieve()
					.body(KeycloakUser.class);
		} catch (HttpStatusCodeException e) {
			if (e.getStatusCode().is5xxServerError()) {
				throw new ServiceUnavailableException("Keycloak service is unavailable");
			}
			throw new KeycloakException("Failed to get user ( %s )".formatted(id), e);
		}
	}


	public void updateUser(UUID id, AccountDto accountDto) throws ServiceUnavailableException {
		var accessToken = generateAccessToken();
		try {
			restClient
					.put()
					.uri("/admin/realms/%s/users/%s".formatted(keycloakRealm, id))
					.accept(MediaType.APPLICATION_JSON)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
					.body(accountMapper.toKeycloakAccountUpdateDto(accountDto))
					.retrieve()
					.toBodilessEntity();
		} catch (HttpStatusCodeException e) {
			if (e.getStatusCode().is5xxServerError()) {
				throw new ServiceUnavailableException("Keycloak service is unavailable");
			}
			throw new KeycloakException("Failed to update user ( %s )".formatted(id), e);
		}
	}


	private String generateAccessToken() {
		var client = authorizedClientManager.authorize(OAuth2AuthorizeRequest
				.withClientRegistrationId("keycloak")
				.principal("keycloak-client")
				.build()
		);
		if (client == null) {
			throw new KeycloakException("Failed to authorize client");
		}
		return client.getAccessToken().getTokenValue();
	}

}
