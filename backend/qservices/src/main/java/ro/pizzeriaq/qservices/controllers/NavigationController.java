package ro.pizzeriaq.qservices.controllers;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiDirections;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiLocation;
import ro.pizzeriaq.qservices.services.GoogleMapsApiService;
import ro.pizzeriaq.qservices.services.RestaurantConstantsService;

import javax.naming.ServiceUnavailableException;

@RestController
@AllArgsConstructor
public class NavigationController {

	private final GoogleMapsApiService googleMapsApiService;
	private final RestaurantConstantsService restaurantConstantsService;


	@GetMapping("/directions")
	public GoogleApiDirections getDirections(
			@RequestParam @NotBlank String origin,
			@RequestParam @NotBlank  String destination
	) throws ServiceUnavailableException {
		return googleMapsApiService.getDirections(origin, destination);
	}


	@GetMapping("/locations")
	public ResponseEntity<?> getAddress(
			@RequestParam(required = false) String address,
			@RequestParam(required = false) Double latitude,
			@RequestParam(required = false) Double longitude
	) throws ServiceUnavailableException {
		if (StringUtils.hasText(address)) {
			return ResponseEntity.ok(googleMapsApiService.getGeocode(address));
		}
		else if (latitude != null && longitude != null) {
			return ResponseEntity.ok(googleMapsApiService.getAddress(latitude, longitude));
		}

		return ResponseEntity.badRequest()
				.body("Either 'address' or both 'latitude' and 'longitude' must be provided as request parameters.");
	}


	@GetMapping("/locations/restaurant")
	public GoogleApiLocation getRestaurantLocation() {
		return restaurantConstantsService.getRestaurantLocation();
	}

}
