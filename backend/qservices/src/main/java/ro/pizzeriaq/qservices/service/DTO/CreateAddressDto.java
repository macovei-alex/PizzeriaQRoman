package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateAddressDto(
		@NotBlank String addressString,
		@NotNull boolean isPrimary
) {
}
