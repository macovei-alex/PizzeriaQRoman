package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.DTO.PushNotificationRequestDto;
import ro.pizzeriaq.qservices.service.DTO.PushNotificationTokenDto;
import ro.pizzeriaq.qservices.service.NotificationsService;

@RestController
@RequestMapping("/notifications")
@AllArgsConstructor
public class NotificationsController {

	private final NotificationsService notificationsService;


	@PostMapping("/send")
	public void sendNotification(@Valid @RequestBody PushNotificationRequestDto notificationRequest) {
		notificationsService.sendNotification(notificationRequest.getTitle(), notificationRequest.getBody());
	}


	@PostMapping("/push-tokens")
	public void registerDevice(@RequestBody PushNotificationTokenDto notificationToken) {
		notificationsService.addPushToken(notificationToken.getToken());
	}


	@DeleteMapping("/push-tokens")
	public void unregisterDevice(@Valid @RequestBody PushNotificationTokenDto notificationToken) {
		notificationsService.removePushToken(notificationToken.getToken());
	}

}
