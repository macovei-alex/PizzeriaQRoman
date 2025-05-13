package ro.pizzeriaq.qservices.service.mappers;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.entity.Address;
import ro.pizzeriaq.qservices.data.entity.AddressType;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;

import java.util.Objects;

@Component
public class AddressMapper {


	public AddressDto fromEntity(@NonNull Address entity) {
		return AddressDto.builder()
				.id(entity.getId())
				.addressType(entity.getAddressType().getName())
				.city(entity.getCity())
				.street(entity.getStreet())
				.streetNumber(entity.getStreetNumber())
				.block(entity.getBlock())
				.floor(entity.getFloor())
				.apartment(entity.getApartment())
				.isPrimary(entity.isPrimary())
				.build();
	}


	public Address fromDto(@NonNull AddressDto dto, Account account, AddressType addressType) {
		return Address.builder()
				.id(Objects.equals(dto.id(), 0) ? null : dto.id())
				.account(account)
				.addressType(addressType)
				.city(dto.city())
				.street(dto.street())
				.streetNumber(dto.streetNumber())
				.block(dto.block())
				.floor(dto.floor())
				.apartment(dto.apartment())
				.isPrimary(dto.isPrimary())
				.build();
	}


	public void updateEntity(@NonNull Address entity, @NonNull AddressDto dto, @Nullable AddressType addressType) {
		if (!dto.addressType().equals(entity.getAddressType().getName())) {
			entity.setAddressType(addressType);
		}
		entity.setCity(dto.city());
		entity.setStreet(dto.street());
		entity.setStreetNumber(dto.streetNumber());
		entity.setBlock(dto.block());
		entity.setFloor(dto.floor());
		entity.setApartment(dto.apartment());
		entity.setPrimary(dto.isPrimary());
	}

}
