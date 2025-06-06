package ro.pizzeriaq.qservices.controllers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiDirections;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiLocation;
import ro.pizzeriaq.qservices.services.GoogleMapsApiService;

import javax.naming.ServiceUnavailableException;

@RestController
@RequestMapping("/navigation")
@AllArgsConstructor
public class NavigationController {

	private final GoogleMapsApiService googleMapsApiService;


	@GetMapping("/directions")
	public GoogleApiDirections getDirections(
			@NotBlank @RequestParam String origin,
			@NotBlank @RequestParam String destination
	) throws ServiceUnavailableException {
		return googleMapsApiService.getDirections(origin, destination);
	}


	@GetMapping("/address")
	public String getAddress(
			@NotNull @RequestParam Double latitude,
			@NotNull @RequestParam Double longitude
	) throws ServiceUnavailableException {
		return googleMapsApiService.getAddress(latitude, longitude);
	}


	@GetMapping("/coordinates")
	public GoogleApiLocation getGeocode(@NotBlank @RequestParam String address) throws ServiceUnavailableException {
		return googleMapsApiService.getGeocode(address);
	}

}
