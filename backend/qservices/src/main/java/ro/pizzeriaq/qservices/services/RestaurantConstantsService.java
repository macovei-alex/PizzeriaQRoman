package ro.pizzeriaq.qservices.services;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiLocation;

import javax.naming.ServiceUnavailableException;

@Service
public class RestaurantConstantsService {

	@Getter
	private final GoogleApiLocation restaurantLocation;


	public RestaurantConstantsService(
			GoogleMapsApiService googleMapsApiService,
			@Value("${app.restaurant.address}") String restaurantAddress
	) {
		try {
			this.restaurantLocation = googleMapsApiService.getGeocode(restaurantAddress);
		} catch (ServiceUnavailableException e) {
			throw new RuntimeException("Failed to initialize restaurant location: " + e.getMessage(), e);
		}
	}

}
