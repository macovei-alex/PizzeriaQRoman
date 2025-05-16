package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.GoogleApiDirections;
import ro.pizzeriaq.qservices.service.GoogleMapsApiService;

@RestController
@RequestMapping("/navigation")
@AllArgsConstructor
public class NavigationController {

	private final GoogleMapsApiService googleMapsApiService;


	@GetMapping("/directions")
	public GoogleApiDirections getDirections(@RequestParam String origin, @RequestParam String destination) {
		return googleMapsApiService.getDirections(origin, destination);
	}

}
