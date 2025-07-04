package ro.pizzeriaq.qservices.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.data.dtos.RestaurantConstantsDto;
import ro.pizzeriaq.qservices.services.RestaurantConstantsService;

@RestController
@RequestMapping("/restaurant")
@AllArgsConstructor
public class RestaurantConstantsController {

	private final RestaurantConstantsService restaurantConstantsService;


	@GetMapping
	public RestaurantConstantsDto getConstants() {
		return restaurantConstantsService.getConstants();
	}
}
