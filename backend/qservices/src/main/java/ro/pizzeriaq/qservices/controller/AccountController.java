package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.util.List;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(AccountController.class);

	private final KeycloakService keycloakService;


	@GetMapping("/all")
	public List<KeycloakUser> getAccounts() {
		try {
			return keycloakService.getUsers();
		} catch (KeycloakException e) {
			logger.error("Failed to get users from Keycloak", e);
			throw e;
		}
	}

}
