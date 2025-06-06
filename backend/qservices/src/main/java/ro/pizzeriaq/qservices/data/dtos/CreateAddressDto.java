package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateAddressDto(
		@NotBlank String addressString,
		@NotNull boolean isPrimary
) {
}
