package ro.pizzeriaq.qservices.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.repositories.AddressRepository;
import ro.pizzeriaq.qservices.repositories.AddressTypeRepository;
import ro.pizzeriaq.qservices.data.dtos.AddressDto;
import ro.pizzeriaq.qservices.data.dtos.CreateAddressDto;
import ro.pizzeriaq.qservices.services.mappers.AddressMapper;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AddressService {

	private final AddressRepository addressRepository;
	private final AccountRepository accountRepository;
	private final AddressTypeRepository addressTypeRepository;
	private final AddressMapper addressMapper;


	public List<AddressDto> getAddressesForAccount(UUID accountId) {
		return addressRepository.findAllActiveByAccountId(accountId)
				.stream()
				.map(addressMapper::fromEntity)
				.toList();
	}


	public AddressDto createAddress(UUID userId, CreateAddressDto address) {
		var account = accountRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("Account with id ( %s ) not found".formatted(userId)));

		var addressTypeName = "Home";
		var addressType = addressTypeRepository.findByName(addressTypeName)
				.orElseThrow(() -> new EntityNotFoundException("Address type with name ( %s ) not found"
						.formatted(addressTypeName)
				));

		var newEntity = addressMapper.fromDto(address, account, addressType);
		newEntity = addressRepository.save(newEntity);

		return addressMapper.fromEntity(newEntity);
	}


	public void deleteAddress(int addressId) {
		var address = addressRepository.findById(addressId)
				.orElseThrow(() -> new EntityNotFoundException("Address with id ( %s ) not found".formatted(addressId)));
		address.setActive(false);
		addressRepository.save(address);
	}
}
