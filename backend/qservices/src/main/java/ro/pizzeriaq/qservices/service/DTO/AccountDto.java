package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.NotBlank;

public record AccountDto(
		@NotBlank(message = "First name cannot be blank")
		String firstName,

		@NotBlank(message = "Last name cannot be blank")
		String lastName,

		@NotBlank(message = "Email cannot be blank")
		String email,

		@NotBlank(message = "Phone number cannot be blank")
		String phoneNumber
) {
}
