package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@AllArgsConstructor
public class NotificationsController {


	@PostMapping("/devices")
	public void registerDevice(@RequestBody Map<String, Object> payload) {
		System.out.println("Registered device: " + payload);
	}

}
