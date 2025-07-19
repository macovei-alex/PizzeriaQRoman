package ro.pizzeriaq.qservices.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ro.pizzeriaq.qservices.data.entities.PushToken;
import ro.pizzeriaq.qservices.repositories.PushTokenRepository;
import ro.pizzeriaq.qservices.data.dtos.PushNotificationDto;

@Slf4j
@Service
public class NotificationsService {

	private final PushTokenRepository pushTokenRepository;
	private final RestClient restClient;


	public NotificationsService(PushTokenRepository pushTokenRepository) {
		this.pushTokenRepository = pushTokenRepository;
		this.restClient = RestClient.builder()
				.baseUrl("https://exp.host/--/api/v2/push/send")
				.defaultHeaders((headers) -> {
					headers.add("Accept", "application/json");
					headers.add("Content-Type", "application/json");
				})
				.build();
	}


	public void addPushToken(String token) {
		try {
			pushTokenRepository.save(new PushToken(token));
		} catch (DataIntegrityViolationException ignored) {
		}
	}


	public void removePushToken(String token) {
		pushTokenRepository.deleteById(token);
	}


	public void sendNotification(String title, String body) {
		var tokens = pushTokenRepository.findAll();

		for (var token : tokens) {
			var notification = new PushNotificationDto(token.getId(), title, body);
			var response = restClient
					.post()
					.body(notification)
					.retrieve()
					.toEntity(String.class);
			if (!response.getStatusCode().is2xxSuccessful()) {
				log.error("Failed to send notification to token ( {} ): Status ( {} ), Response ( {} )",
						token.getId(),
						response.getStatusCode(),
						response.getBody()
				);
			}
		}
	}
}
