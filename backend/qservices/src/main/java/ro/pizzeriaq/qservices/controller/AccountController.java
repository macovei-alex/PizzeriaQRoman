package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.util.List;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountController {
	private final KeycloakService keycloakService;


	@GetMapping
	public List<KeycloakUser> getAccounts() {
		return keycloakService.getUsers();
	}

}
