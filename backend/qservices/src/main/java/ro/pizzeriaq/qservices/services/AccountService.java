package ro.pizzeriaq.qservices.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.dtos.UpdateAccountDto;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.services.mappers.AccountMapper;

import javax.naming.ServiceUnavailableException;
import java.util.UUID;

@Slf4j
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


	@Transactional(rollbackFor = {
			ServiceUnavailableException.class,
			KeycloakException.class
	})
	public void update(UUID id, UpdateAccountDto updateAccountDto) throws ServiceUnavailableException {
		var oldAccount = accountRepository.findActiveById(id)
				.orElseThrow(() -> new EntityNotFoundException("Account not found"));

		oldAccount.setEmail(updateAccountDto.email());
		oldAccount.setPhoneNumber(updateAccountDto.phoneNumber());
		accountRepository.saveAndFlush(oldAccount);

		try {
			keycloakService.updateUser(id, updateAccountDto);
		} catch (ServiceUnavailableException | KeycloakException e) {
			log.error(
					"Something went wrong while trying to synchronize the account update with Keycloak. " +
							"The changes will be rolled back from the database.",
					e
			);
			throw e;
		}
	}


	public String getPhoneNumber(UUID id) {
		return accountRepository.findActiveById(id)
				.orElseThrow(() -> new EntityNotFoundException("Account not found"))
				.getPhoneNumber();
	}

}
