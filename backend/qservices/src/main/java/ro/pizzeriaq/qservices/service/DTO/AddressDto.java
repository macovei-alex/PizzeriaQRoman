package ro.pizzeriaq.qservices.service.DTO;

import lombok.Builder;

@Builder
public record AddressDto(
		Integer id,
		String addressType,
		String city,
		String street,
		String streetNumber,
		String block,
		int floor,
		String apartment,
		boolean isPrimary
) {
}
