package ro.pizzeriaq.qservices.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.services.AccountService;
import ro.pizzeriaq.qservices.data.dtos.UpdateAccountDto;
import ro.pizzeriaq.qservices.services.KeycloakService;

import javax.naming.ServiceUnavailableException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
@AllArgsConstructor
public class AccountController {


	private final KeycloakService keycloakService;
	private final AccountService accountService;


	@GetMapping
	public List<KeycloakUser> getAccounts() throws ServiceUnavailableException {
		return keycloakService.getUsers();
	}


	@GetMapping("/{accountId}/phone-number")
	@AccountIdChecked
	public String getPhoneNumber(@PathVariable UUID accountId) {
		return accountService.getPhoneNumber(accountId);
	}


	@PutMapping("/{accountTd}")
	@AccountIdChecked
	public void updateAccount(@PathVariable UUID accountTd, @Valid @RequestBody UpdateAccountDto updateAccountDto) {
		accountService.update(accountTd, updateAccountDto);
	}

}
