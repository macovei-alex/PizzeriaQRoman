package ro.pizzeriaq.qservices.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiDirections;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiGeocode;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiLocation;

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

		throwIfInvalid(response);

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

		throwIfInvalid(response);

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

		throwIfInvalid(response);

		return response.getResults().get(0).getGeometry().getLocation();
	}


	private void throwIfInvalid(GoogleApiGeocode response) throws ServiceUnavailableException {
		if (response == null) {
			throw new ServiceUnavailableException("Google Maps Geocode Api service is unavailable");
		} else if (response.getStatus() == null) {
			throw new InternalError("Something went wrong with the Google Maps Geocode API request. No status was returned. Check for DTO schema changes.");
		} else if (response.getStatus().equals("ZERO_RESULTS")) {
			throw new IllegalArgumentException("Address not found");
		} else if (response.getStatus().equals("REQUEST_DENIED")) {
			throw new InternalError("The Google Maps Geocode API request was denied with the following message: "
					+ response.getErrorMessage()
			);
		}
	}


	private void throwIfInvalid(GoogleApiDirections response) throws ServiceUnavailableException {
		if (response == null) {
			throw new ServiceUnavailableException("Google Maps Directions API service is unavailable");
		} else if (response.getStatus() == null) {
			throw new InternalError("Something went wrong with the Google Maps Directions API request. No status was returned. Check for DTO schema changes.");
		} else if (response.getStatus().equals("ZERO_RESULTS")) {
			throw new IllegalArgumentException("Address not found");
		} else if (response.getStatus().equals("REQUEST_DENIED")) {
			throw new InternalError("The Google Maps Directions API request was denied with the following message: "
					+ response.getErrorMessage()
			);
		}
	}
}
