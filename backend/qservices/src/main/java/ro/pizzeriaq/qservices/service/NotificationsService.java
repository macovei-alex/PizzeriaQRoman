package ro.pizzeriaq.qservices.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ro.pizzeriaq.qservices.data.entity.PushToken;
import ro.pizzeriaq.qservices.data.repository.PushTokenRepository;
import ro.pizzeriaq.qservices.service.DTO.PushNotificationDto;

@Service
public class NotificationsService {

	private static final Logger logger = LoggerFactory.getLogger(NotificationsService.class);


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
		var sharedNotification = new PushNotificationDto(null, title, body);

		for (var token : tokens) {
			sharedNotification.setTo(token.getId());
			var response = restClient
					.post()
					.body(sharedNotification)
					.retrieve()
					.toEntity(String.class);
			if (!response.getStatusCode().is2xxSuccessful()) {
				logger.error("Failed to send notification to token ( {} ): Status ( {} ), Response ( {} )",
						token.getId(),
						response.getStatusCode(),
						response.getBody()
				);
			}
		}
	}
}
