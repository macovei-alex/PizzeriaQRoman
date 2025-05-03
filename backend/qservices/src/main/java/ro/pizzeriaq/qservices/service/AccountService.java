package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;


	// TODO: Add some tests
	@Transactional
	public List<AddressDto> getAddresses(UUID id) {
		var account = accountRepository.findById(id)
				.stream()
				.findFirst();
		if (account.isEmpty()) {
			throw new RuntimeException("Account not found");
		}

		var addresses = account.get().getAddresses();
		return addresses.stream()
				.map(address -> AddressDto.builder()
						.id(address.getId())
						.addressType(address.getAddressType().getName())
						.city(address.getCity())
						.street(address.getStreet())
						.streetNumber(address.getStreetNumber())
						.block(address.getBlock())
						.floor(address.getFloor())
						.apartment(address.getApartment())
						.isPrimary(address.isPrimary())
						.build())
				.toList();
	}
}
