package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ro.pizzeriaq.qservices.service.DTO.PushNotificationDto;

import java.util.List;

@Service
public class NotificationsService {


	private final List<String> tokens = List.of("ExponentPushToken[mBBFYiN7yo1dkGwbcDo_8J]");
	private final RestClient restClient;


	public NotificationsService() {
		restClient = RestClient.builder()
				.baseUrl("https://exp.host/--/api/v2/push/send")
				.defaultHeaders((headers) -> {
					headers.add("Accept", "application/json");
					headers.add("Content-Type", "application/json");
				})
				.build();
	}


	public void sendNotification(String title, String body) {
		var notification = new PushNotificationDto();
		notification.setTo(tokens.get(0));
		notification.setTitle(title);
		notification.setBody(body);
		var response = restClient
				.post()
				.body(notification)
				.retrieve()
				.toBodilessEntity();
		if (!response.getStatusCode().is2xxSuccessful()) {
			throw new RuntimeException("Failed to send notification: " + response.getStatusCode());
		}
	}
}
