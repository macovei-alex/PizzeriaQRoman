package ro.pizzeriaq.qservices.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.data.repository.AddressRepository;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;
import ro.pizzeriaq.qservices.service.DTO.mapper.AccountMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.AddressMapper;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;
	private final AddressRepository addressRepository;
	private final AddressMapper addressMapper;
	private final AccountMapper accountMapper;


	// TODO: Add some tests
	@Transactional
	public List<AddressDto> getAddresses(UUID id) {
		if (!accountRepository.existsById(id)) {
			throw new EntityNotFoundException("Account not found");
		}
		return addressRepository.findAllActiveByAccountId(id)
				.stream()
				.map(addressMapper::fromEntity)
				.toList();
	}


	public void createAccount(KeycloakUser keycloakUser) {
		System.out.println("Creating account for user: " + keycloakUser.id());
		var account = accountMapper.fromKeycloakUser(keycloakUser);
		accountRepository.save(account);
	}


	public boolean exists(UUID id) {
		return accountRepository.existsById(id);
	}

}
