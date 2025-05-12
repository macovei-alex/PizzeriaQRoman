package ro.pizzeriaq.qservices.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.service.DTO.AccountDto;
import ro.pizzeriaq.qservices.service.mappers.AccountMapper;

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


	public boolean exists(UUID id) {
		return accountRepository.existsById(id);
	}


	@Transactional
	public void update(UUID id, AccountDto accountDto) {
		var oldAccount = accountRepository.findById(id)
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
		return accountRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Account not found"))
				.getPhoneNumber();
	}

}
