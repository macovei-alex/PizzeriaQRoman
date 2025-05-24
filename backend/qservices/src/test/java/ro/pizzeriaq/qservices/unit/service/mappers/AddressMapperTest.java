package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.entity.Address;
import ro.pizzeriaq.qservices.data.entity.AddressType;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;
import ro.pizzeriaq.qservices.service.DTO.CreateAddressDto;
import ro.pizzeriaq.qservices.service.mappers.AddressMapper;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class AddressMapperTest {

	private final AddressMapper addressMapper = new AddressMapper();

	@Test
	void fromEntityThrows() {
		assertThrows(NullPointerException.class, () -> addressMapper.fromEntity(Address.builder().build()));
	}

	@Test
	void fromEntityMinimalWorkingCase() {
		assertDoesNotThrow(() -> addressMapper.fromEntity(Address.builder().addressType(new AddressType()).build()));
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
				.addressType(AddressType.builder().name("name").build())
				.addressString("city, street, streetNumber, block, floor 2, apartment")
				.isPrimary(true)
				.build();
		var expectedDto = AddressDto.builder()
				.id(1)
				.addressType("name")
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
				.addressType(AddressType.builder().name("addressType").build())
				.addressString("city, street, streetNumber, block, floor 2, apartment")
				.isPrimary(true)
				.build();

		assertEquals(expectedEntity, addressMapper.fromDto(
				dto,
				Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build(),
				AddressType.builder().name("addressType").build()));
	}
}
