package ro.pizzeriaq.qservices.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiLocation;

import javax.naming.ServiceUnavailableException;

@Slf4j
@Service
public class RestaurantConstantsService {

	private final String restaurantAddress;
	private final GoogleMapsApiService googleMapsApiService;
	private GoogleApiLocation restaurantLocation;


	public RestaurantConstantsService(
			GoogleMapsApiService googleMapsApiService,
			@Value("${app.restaurant.address}") String restaurantAddress
	) {
		this.restaurantAddress = restaurantAddress;
		this.googleMapsApiService = googleMapsApiService;
		try {
			this.restaurantLocation = googleMapsApiService.getGeocode(restaurantAddress);
		} catch (ServiceUnavailableException e) {
			log.warn("Failed to initialize restaurant location {}", e.getMessage());
		}
	}


	public GoogleApiLocation getRestaurantLocation() {
		if (restaurantLocation != null){
			return restaurantLocation;
		}

		try {
			return googleMapsApiService.getGeocode(restaurantAddress);
		} catch (ServiceUnavailableException e) {
			throw new RuntimeException("Failed to initialize restaurant location: " + e.getMessage(), e);
		}
	}
}
