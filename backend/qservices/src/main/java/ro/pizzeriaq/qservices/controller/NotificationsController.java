package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.PushNotificationRequestDto;
import ro.pizzeriaq.qservices.service.NotificationsService;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@AllArgsConstructor
public class NotificationsController {

	private final NotificationsService notificationsService;


	@PostMapping("/send")
	public void sendNotification(@RequestBody PushNotificationRequestDto notificationRequest) {
		notificationsService.sendNotification(notificationRequest.getTitle(), notificationRequest.getBody());
	}


	@PostMapping("/push-tokens")
	public void registerDevice(@RequestBody Map<String, Object> payload) {
		System.out.println("Registered device: " + payload);
	}

}
