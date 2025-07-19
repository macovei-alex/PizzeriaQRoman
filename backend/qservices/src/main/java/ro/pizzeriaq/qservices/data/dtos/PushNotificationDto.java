package ro.pizzeriaq.qservices.data.dtos;

import lombok.Builder;

@Builder
public record PushNotificationDto(
		String to,
		String title,
		String body
) {
}
