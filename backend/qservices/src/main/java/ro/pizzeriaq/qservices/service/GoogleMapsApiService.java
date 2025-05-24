package ro.pizzeriaq.qservices.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import ro.pizzeriaq.qservices.service.DTO.navigation.GoogleApiDirections;
import ro.pizzeriaq.qservices.service.DTO.navigation.GoogleApiGeocode;
import ro.pizzeriaq.qservices.service.DTO.navigation.GoogleApiLocation;

import javax.naming.ServiceUnavailableException;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;

@Service
public class GoogleMapsApiService {

	private final RestClient restClient;
	private final String apiKey;


	public GoogleMapsApiService(@Value("${google-maps.api-key}") String apiKey) {
		assertNotNull(apiKey);

		this.apiKey = apiKey;
		this.restClient = RestClient.builder()
				.baseUrl("https://maps.googleapis.com/maps/api")
				.build();
	}


	public GoogleApiDirections getDirections(
			String origin,
			String destination
	) throws ServiceUnavailableException {
		String uri = UriComponentsBuilder.fromUriString("/directions/json")
				.queryParam("origin", origin)
				.queryParam("destination", destination)
				.queryParam("mode", "driving")
				.queryParam("key", apiKey)
				.build()
				.toUriString();

		var response = restClient.get()
				.uri(uri)
				.retrieve()
				.body(GoogleApiDirections.class);

		if (response == null) {
			throw new ServiceUnavailableException("Google Maps API service is unavailable");
		}
		return response;
	}


	public String getAddress(double latitude, double longitude) throws ServiceUnavailableException {
		String uri = UriComponentsBuilder.fromUriString("/geocode/json")
				.queryParam("latlng", latitude + "," + longitude)
				.queryParam("key", apiKey)
				.build()
				.toUriString();

		var response = restClient.get()
				.uri(uri)
				.retrieve()
				.body(GoogleApiGeocode.class);

		if (response == null) {
			throw new ServiceUnavailableException("Google Maps API service is unavailable");
		}

		if(response.getStatus().equals("ZERO_RESULTS")) {
			throw new IllegalArgumentException("Address not found");
		}

		return response.getResults().get(0).getFormattedAddress();
	}


	public GoogleApiLocation getGeocode(String address) throws ServiceUnavailableException {
		String uri = UriComponentsBuilder.fromUriString("/geocode/json")
				.queryParam("address", address)
				.queryParam("key", apiKey)
				.build()
				.toUriString();

		var response = restClient.get()
				.uri(uri)
				.retrieve()
				.body(GoogleApiGeocode.class);

		if (response == null) {
			throw new ServiceUnavailableException("Google Maps API service is unavailable");
		}

		if(response.getStatus().equals("ZERO_RESULTS")) {
			throw new IllegalArgumentException("Geocode not found for address: " + address);
		}

		return response.getResults().get(0).getGeometry().getLocation();
	}
}
