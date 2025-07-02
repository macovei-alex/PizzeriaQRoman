package ro.pizzeriaq.qservices.services.mappers;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.data.entities.Address;
import ro.pizzeriaq.qservices.data.entities.AddressType;
import ro.pizzeriaq.qservices.data.dtos.AddressDto;
import ro.pizzeriaq.qservices.data.dtos.CreateAddressDto;

@Component
public class AddressMapper {


	public AddressDto fromEntity(@NonNull Address entity) {
		return AddressDto.builder()
				.id(entity.getId())
				.addressType(entity.getAddressType().name())
				.addressString(entity.getAddressString())
				.isPrimary(entity.isPrimary())
				.build();
	}


	public Address fromDto(@NonNull CreateAddressDto dto, Account account, AddressType addressType) {
		return Address.builder()
				.id(null)
				.account(account)
				.addressType(addressType)
				.addressString(dto.addressString())
				.isPrimary(dto.isPrimary())
				.build();
	}

}
