package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.data.entities.Address;
import ro.pizzeriaq.qservices.data.entities.AddressType;
import ro.pizzeriaq.qservices.data.dtos.AddressDto;
import ro.pizzeriaq.qservices.data.dtos.CreateAddressDto;
import ro.pizzeriaq.qservices.services.mappers.AddressMapper;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class AddressMapperTest {

	final AddressMapper addressMapper = new AddressMapper();

	@Test
	void fromEntityThrows() {
		assertThrows(NullPointerException.class, () -> addressMapper.fromEntity(Address.builder().build()));
	}

	@Test
	void fromEntityMinimalWorkingCase() {
		assertDoesNotThrow(() -> addressMapper.fromEntity(Address.builder().addressType(AddressType.HOME).build()));
	}

	@Test
	void fromDtoMinimalWorkingCase() {
		assertDoesNotThrow(() -> addressMapper.fromDto(CreateAddressDto.builder().build(), null, null));
	}

	@Test
	void fromEntityValid() {
		var entity = Address.builder()
				.id(1)
				.account(null)
				.addressType(AddressType.HOME)
				.addressString("city, street, streetNumber, block, floor 2, apartment")
				.isPrimary(true)
				.build();
		var expectedDto = AddressDto.builder()
				.id(1)
				.addressType(AddressType.HOME.name())
				.addressString("city, street, streetNumber, block, floor 2, apartment")
				.isPrimary(true)
				.build();

		assertEquals(expectedDto, addressMapper.fromEntity(entity));
	}

	@Test
	void fromDtoValid() {
		var dto = CreateAddressDto.builder()
				.addressString("city, street, streetNumber, block, floor 2, apartment")
				.isPrimary(true)
				.build();
		var expectedEntity = Address.builder()
				.id(null)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.HOME)
				.addressString("city, street, streetNumber, block, floor 2, apartment")
				.isPrimary(true)
				.build();

		assertEquals(expectedEntity, addressMapper.fromDto(
				dto,
				Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build(),
				AddressType.HOME
		));
	}
}
