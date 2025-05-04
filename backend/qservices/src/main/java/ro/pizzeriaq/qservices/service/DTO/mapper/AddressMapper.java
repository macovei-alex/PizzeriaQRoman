package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.entity.Address;
import ro.pizzeriaq.qservices.data.entity.AddressType;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;

@Component
public class AddressMapper {

	public AddressDto fromEntity(Address entity) {
		if (entity == null) {
			return null;
		}

		return AddressDto.builder()
				.id(entity.getId())
				.addressType(entity.getAddressType().getName())
				.city(entity.getCity())
				.street(entity.getStreet())
				.streetNumber(entity.getStreetNumber())
				.block(entity.getBlock())
				.floor(entity.getFloor())
				.apartment(entity.getApartment())
				.build();
	}


	public Address fromDto(AddressDto dto, Account account, AddressType addressType) {
		if (dto == null) {
			return null;
		}

		return Address.builder()
				.account(account)
				.addressType(addressType)
				.city(dto.getCity())
				.street(dto.getStreet())
				.streetNumber(dto.getStreetNumber())
				.block(dto.getBlock())
				.floor(dto.getFloor())
				.apartment(dto.getApartment())
				.isPrimary(false)
				.build();
	}


	public Address updateEntity(Address entity, AddressDto dto) {
		if (dto == null) {
			return entity;
		}

		entity.setCity(dto.getCity());
		entity.setStreet(dto.getStreet());
		entity.setStreetNumber(dto.getStreetNumber());
		entity.setBlock(dto.getBlock());
		entity.setFloor(dto.getFloor());
		entity.setApartment(dto.getApartment());

		return entity;
	}

}
