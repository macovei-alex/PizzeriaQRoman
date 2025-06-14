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
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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
		var encodedToken = URLEncoder.encode(notificationToken.getToken(), StandardCharsets.UTF_8);
		return ResponseEntity.created(URI.create("/devices/" + encodedToken)).build();
	}


	@DeleteMapping("/devices/{encodedToken}")
	public ResponseEntity<Void> unregisterDevice(@PathVariable @NotBlank String encodedToken) {
		var token = URLDecoder.decode(encodedToken, StandardCharsets.UTF_8);
		notificationsService.removePushToken(token);
		return ResponseEntity.noContent().build();
	}

}
