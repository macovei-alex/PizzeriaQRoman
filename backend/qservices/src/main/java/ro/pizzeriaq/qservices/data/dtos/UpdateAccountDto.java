package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

@Builder
public record UpdateAccountDto(
		@NotBlank(message = "First name cannot be blank")
		String firstName,

		@NotBlank(message = "Last name cannot be blank")
		String lastName,

		@NotBlank(message = "Email cannot be blank")
		@Length(max = 100, message = "Email cannot exceed 100 characters")
		String email,

		@NotBlank(message = "Phone number cannot be blank")
		@Length(max = 20, message = "Phone number cannot exceed 20 characters")
		String phoneNumber
) {
}
