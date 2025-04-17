package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountController {

	private final KeycloakService keycloakService;


	@GetMapping("/all")
	public List<Map<String, Object>> getAccounts() {
		return keycloakService.getUsers();
	}
}
