package ro.pizzeriaq.qservices.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import ro.pizzeriaq.qservices.service.DTO.GoogleApiDirections;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;

@Service
public class GoogleMapsApiService {

	private final RestClient restClient;
	private final String apiKey;


	public GoogleMapsApiService(@Value("${google-maps.api-key}") String apiKey) {
		assertNotNull(apiKey);

		this.apiKey = apiKey;
		this.restClient = RestClient.builder()
				.baseUrl("https://maps.googleapis.com/maps/api/directions/json")
				.build();
	}


	public GoogleApiDirections getDirections(String origin, String destination) {
		String uri = UriComponentsBuilder.fromUriString("")
				.queryParam("origin", origin)
				.queryParam("destination", destination)
				.queryParam("mode", "driving")
				.queryParam("key", apiKey)
				.build()
				.toUriString();
		return restClient.get()
				.uri(uri)
				.retrieve()
				.body(GoogleApiDirections.class);
	}
}
