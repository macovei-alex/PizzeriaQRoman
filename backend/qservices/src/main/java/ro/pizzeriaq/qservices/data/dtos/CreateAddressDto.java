package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CreateAddressDto(
		@NotBlank String addressString,
		boolean isPrimary
) {
}
