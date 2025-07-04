package ro.pizzeriaq.qservices.data.dtos;

import lombok.Data;
import ro.pizzeriaq.qservices.data.dtos.navigation.GoogleApiLocation;

import java.math.BigDecimal;

@Data
public class RestaurantConstantsDto {

	private String address;
	private GoogleApiLocation location;
	private String email;
	private String phoneNumber;
	private BigDecimal minimumOrderValue;
	private String[] hours;

}
