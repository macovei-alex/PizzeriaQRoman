package ro.pizzeriaq.qservices.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.dtos.RestaurantConstantsDto;

import javax.naming.ServiceUnavailableException;
import java.math.BigDecimal;

@Slf4j
@Service
public class RestaurantConstantsService {

	private final RestaurantConstantsDto constants;

	private final GoogleMapsApiService googleMapsApiService;


	public RestaurantConstantsService(
			GoogleMapsApiService googleMapsApiService,
			@Value("${app.restaurant.address}") String restaurantAddress,
			@Value("${app.restaurant.phone-number}") String phoneNumber,
			@Value("${app.restaurant.email}") String emailAddress,
			@Value("${app.restaurant.minimum-order-value}") BigDecimal minimumOrderValue,
			@Value("${app.restaurant.hours}") String[] hours
	) {
		constants = new RestaurantConstantsDto();
		constants.setAddress(restaurantAddress);
		constants.setEmail(emailAddress);
		constants.setPhoneNumber(phoneNumber);
		constants.setMinimumOrderValue(minimumOrderValue);
		constants.setHours(hours);

		this.googleMapsApiService = googleMapsApiService;
		try {
			constants.setLocation(googleMapsApiService.getGeocode(restaurantAddress));
		} catch (ServiceUnavailableException e) {
			log.warn("Failed to initialize restaurant location {}", e.getMessage());
		}
	}


	public RestaurantConstantsDto getConstants() {
		if (constants.getLocation() != null) {
			return constants;
		}

		try {
			constants.setLocation(googleMapsApiService.getGeocode(constants.getAddress()));
			return constants;
		} catch (ServiceUnavailableException e) {
			throw new RuntimeException("Failed to initialize restaurant location: " + e.getMessage(), e);
		}
	}
}
