package ro.pizzeriaq.qservices.controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.data.dtos.PushNotificationRequestDto;
import ro.pizzeriaq.qservices.data.dtos.PushNotificationTokenDto;
import ro.pizzeriaq.qservices.services.NotificationsService;

import java.net.URI;

@RestController
@AllArgsConstructor
public class NotificationsController {

	private final NotificationsService notificationsService;


	@PostMapping("/notifications")
	public void sendNotification(@RequestBody @Valid PushNotificationRequestDto notificationRequest) {
		notificationsService.sendNotification(notificationRequest.getTitle(), notificationRequest.getBody());
	}


	@PostMapping("/devices")
	public ResponseEntity<Void> registerDevice(@RequestBody @Valid PushNotificationTokenDto notificationToken) {
		notificationsService.addPushToken(notificationToken.getToken());
		return ResponseEntity.created(URI.create("/devices/" + notificationToken.getToken())).build();
	}


	@DeleteMapping("/devices/{notificationToken}")
	public ResponseEntity<Void> unregisterDevice(@PathVariable @NotBlank String notificationToken) {
		notificationsService.removePushToken(notificationToken);
		return ResponseEntity.noContent().build();
	}

}
