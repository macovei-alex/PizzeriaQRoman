package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record SendPushNotificationRequestDto(
		@NotBlank String title,
		@NotBlank String body
) {
}
