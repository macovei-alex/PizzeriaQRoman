package ro.pizzeriaq.qservices.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.data.dtos.AccountDto;
import ro.pizzeriaq.qservices.services.mappers.AccountMapper;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;
	private final AccountMapper accountMapper;
	private final KeycloakService keycloakService;


	public void createAccount(KeycloakUser keycloakUser) {
		var account = accountMapper.toAccount(keycloakUser);
		accountRepository.save(account);
	}


	public boolean existsActive(UUID id) {
		return accountRepository.existsActiveById(id);
	}


	@Transactional
	public void update(UUID id, AccountDto accountDto) {
		var oldAccount = accountRepository.findActiveById(id)
				.orElseThrow(() -> new EntityNotFoundException("Account not found"));

		try {
			keycloakService.updateUser(id, accountDto);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update account in Keycloak, changes reverted in local database", e);
		}

		oldAccount.setEmail(accountDto.email());
		oldAccount.setPhoneNumber(accountDto.phoneNumber());
		accountRepository.save(oldAccount);
	}


	public String getPhoneNumber(UUID id) {
		return accountRepository.findActiveById(id)
				.orElseThrow(() -> new EntityNotFoundException("Account not found"))
				.getPhoneNumber();
	}

}
