package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record AddressDto(
		Integer id,
		@NotBlank String addressType,
		@NotBlank String addressString,
		@NotNull boolean isPrimary
) {
}
