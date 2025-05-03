package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

@Data
@Builder
public class AddressDto {

	private Integer id;
	private String addressType;
	private String city;
	private String street;
	private String streetNumber;
	private String block;
	private int floor;
	private String apartment;
	private boolean isPrimary;

}
