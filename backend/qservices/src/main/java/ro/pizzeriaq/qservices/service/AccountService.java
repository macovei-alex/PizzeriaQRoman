package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.service.DTO.mapper.AccountMapper;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;
	private final AccountMapper accountMapper;


	public void createAccount(KeycloakUser keycloakUser) {
		var account = accountMapper.fromKeycloakUser(keycloakUser);
		accountRepository.save(account);
	}


	public boolean exists(UUID id) {
		return accountRepository.existsById(id);
	}

}
