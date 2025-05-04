package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;
import ro.pizzeriaq.qservices.service.DTO.mapper.AccountMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.AddressMapper;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;
	private final AddressMapper addressMapper;
	private final AccountMapper accountMapper;


	// TODO: Add some tests
	@Transactional
	public List<AddressDto> getAddresses(UUID id) {
		var account = accountRepository.findById(id);
		if (account.isEmpty()) {
			throw new RuntimeException("Account not found");
		}
		return account.get()
				.getAddresses()
				.stream()
				.map(addressMapper::fromEntity)
				.toList();
	}


	public void createAccount(KeycloakUser keycloakUser) {
		var account = accountMapper.fromKeycloakUser(keycloakUser);
		accountRepository.save(account);
	}


	public boolean existsById(UUID id) {
		return accountRepository.existsById(id);
	}

}
