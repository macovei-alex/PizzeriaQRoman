package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;
import ro.pizzeriaq.qservices.security.Authorities;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(AccountController.class);

	private final KeycloakService keycloakService;
	private final AccountService accountService;


	@GetMapping("/all")
	public List<KeycloakUser> getAccounts() {
		try {
			return keycloakService.getUsers();
		} catch (KeycloakException e) {
			logger.error("Failed to get users from Keycloak", e);
			throw e;
		}
	}


	@GetMapping("{id}/address/all")
	public ResponseEntity<?> getAddresses(@PathVariable String id) {
		var jwtId = SecurityContextHolder.getContext().getAuthentication().getName();
		var isAdmin = SecurityContextHolder.getContext()
				.getAuthentication()
				.getAuthorities()
				.stream()
				.anyMatch(a -> a.getAuthority().equals(Authorities.ADMIN.getName()));
		try {
			if (!id.equals(jwtId) && !isAdmin) {
				return ResponseEntity.status(403).body("");
			}
			var uuid = UUID.fromString(id);
			return ResponseEntity.ok(accountService.getAddresses(uuid));

		} catch (KeycloakException e) {
			logger.error("Failed to get addresses from Keycloak: {}", e.getMessage());
			return ResponseEntity.badRequest().body("Failed to get addresses from Keycloak");

		} catch (IllegalArgumentException e) {
			logger.error("Invalid UUID format: {}", id);
			throw new KeycloakException("Invalid UUID format");

		} catch (Exception e) {
			logger.error("Failed to get addresses: {}", e.getMessage());
			return ResponseEntity.badRequest().body("Failed to get addresses");
		}
	}
}
