package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.DTO.AccountDto;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
@AllArgsConstructor
public class AccountController {


	private final KeycloakService keycloakService;
	private final AccountService accountService;


	@GetMapping
	public List<KeycloakUser> getAccounts() {
		return keycloakService.getUsers();
	}


	@GetMapping("/{accountId}/phone-number")
	@AccountIdChecked
	public String getPhoneNumber(@PathVariable UUID accountId) {
		return accountService.getPhoneNumber(accountId);
	}


	@PutMapping("/{accountTd}")
	@AccountIdChecked
	public void updateAccount(@PathVariable UUID accountTd, @Valid @RequestBody AccountDto accountDto) {
		accountService.update(accountTd, accountDto);
	}

}
