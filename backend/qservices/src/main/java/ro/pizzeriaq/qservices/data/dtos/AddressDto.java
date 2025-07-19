package ro.pizzeriaq.qservices.data.dtos;

import lombok.Builder;

@Builder
public record AddressDto(
		Integer id,
		String addressType,
		String addressString,
		boolean isPrimary
) {
}
