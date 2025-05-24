package ro.pizzeriaq.qservices.service.mappers;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.entity.Address;
import ro.pizzeriaq.qservices.data.entity.AddressType;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;
import ro.pizzeriaq.qservices.service.DTO.CreateAddressDto;

import java.util.Objects;

@Component
public class AddressMapper {


	public AddressDto fromEntity(@NonNull Address entity) {
		return AddressDto.builder()
				.id(entity.getId())
				.addressType(entity.getAddressType().getName())
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
