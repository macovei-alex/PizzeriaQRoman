package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.AccessDeniedException;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.DTO.AccountDto;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
@AllArgsConstructor
public class AccountController {

	private static final Logger logger = LoggerFactory.getLogger(AccountController.class);


	private final KeycloakService keycloakService;
	private final AccountService accountService;
	private final AuthenticationInsightsService authenticationInsightsService;


	@GetMapping
	public List<KeycloakUser> getAccounts() {
		return keycloakService.getUsers();
	}


	@GetMapping("/{accountTd}/phone-number")
	public String getPhoneNumber(@PathVariable UUID accountTd) {
		if (!authenticationInsightsService.isIdSameAs(accountTd)) {
			var authenticationId = authenticationInsightsService.getAuthenticationId();
			logger.error("User ( {} ) is not authorized to access phone number of user ( {} )", authenticationId, accountTd);
			throw new AccessDeniedException("User ( %s ) is not authorized to access phone number of user ( %s )"
					.formatted(authenticationId, accountTd));
		}
		return accountService.getPhoneNumber(accountTd);
	}


	@PutMapping("/{accountTd}")
	public void updateAccount(@PathVariable UUID accountTd, @Valid @RequestBody AccountDto accountDto) {
		if (!authenticationInsightsService.isIdSameAs(accountTd)) {
			var authenticationId = authenticationInsightsService.getAuthenticationId();
			logger.error("User ( {} ) is not authorized to update account with id ( {} )", authenticationId, accountTd);
			throw new AccessDeniedException("User ( %s ) is not authorized to update account data for user ( %s )"
					.formatted(authenticationId, accountTd));
		}
		accountService.update(accountTd, accountDto);
	}

}
