package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.entity.Address;
import ro.pizzeriaq.qservices.data.entity.AddressType;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;
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
		assertDoesNotThrow(() -> addressMapper.fromDto(AddressDto.builder().build(), null, null));
	}

	@Test
	void updateMinimalWorkingCase() {
		assertDoesNotThrow(() -> addressMapper.updateEntity(
				Address.builder().addressType(AddressType.builder().name("").build()).build(),
				AddressDto.builder().addressType("").build(),
				null));
	}

	@Test
	void fromEntityValid() {
		var entity = Address.builder()
				.id(1)
				.account(null)
				.addressType(AddressType.builder().name("name").build())
				.city("city")
				.street("street")
				.streetNumber("streetNumber")
				.block("block")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();
		var expectedDto = AddressDto.builder()
				.id(1)
				.addressType("name")
				.city("city")
				.block("block")
				.street("street")
				.streetNumber("streetNumber")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();

		assertEquals(expectedDto, addressMapper.fromEntity(entity));
	}

	@Test
	void fromDtoValid() {
		var dto = AddressDto.builder()
				.id(1)
				.addressType("addressType")
				.city("city")
				.block("block")
				.street("street")
				.streetNumber("streetNumber")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();
		var expectedEntity = Address.builder()
				.id(1)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType").build())
				.city("city")
				.street("street")
				.streetNumber("streetNumber")
				.block("block")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();

		assertEquals(expectedEntity, addressMapper.fromDto(
				dto,
				Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build(),
				AddressType.builder().name("addressType").build()));
	}

	@Test
	void updateWithSameIdAndAddressType() {
		var dto = AddressDto.builder()
				.id(1)
				.addressType("addressType")
				.city("city")
				.block("block")
				.street("street")
				.streetNumber("streetNumber")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();
		var entity = Address.builder()
				.id(2)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType").build())
				.build();
		var expectedEntity = Address.builder()
				.id(2)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType").build())
				.city("city")
				.street("street")
				.streetNumber("streetNumber")
				.block("block")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();

		addressMapper.updateEntity(entity, dto, null);

		assertEquals(expectedEntity, entity);
	}

	@Test
	void updateWithDifferentIdSameAddressType() {
		var dto = AddressDto.builder()
				.id(0)
				.addressType("addressType")
				.city("city")
				.block("block")
				.street("street")
				.streetNumber("streetNumber")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();
		var entity = Address.builder()
				.id(2)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType").build())
				.build();
		var expectedEntity = Address.builder()
				.id(2)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType").build())
				.city("city")
				.street("street")
				.streetNumber("streetNumber")
				.block("block")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();

		addressMapper.updateEntity(entity, dto, null);

		assertEquals(expectedEntity, entity);
	}

	@Test
	void updateWithSameIdDifferentAddressType() {
		var dto = AddressDto.builder()
				.id(1)
				.addressType("addressType1")
				.city("city")
				.block("block")
				.street("street")
				.streetNumber("streetNumber")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();
		var entity = Address.builder()
				.id(1)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType2").build())
				.build();
		var expectedEntity = Address.builder()
				.id(1)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType1").build())
				.city("city")
				.street("street")
				.streetNumber("streetNumber")
				.block("block")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();

		addressMapper.updateEntity(entity, dto, AddressType.builder().name("addressType1").build());

		assertEquals(expectedEntity, entity);
	}

	@Test
	void updateWithDifferentIdDifferentAddressType() {
		var dto = AddressDto.builder()
				.id(null)
				.addressType("addressType1")
				.city("city")
				.block("block")
				.street("street")
				.streetNumber("streetNumber")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();
		var entity = Address.builder()
				.id(1)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType2").build())
				.build();
		var expectedEntity = Address.builder()
				.id(1)
				.account(Account.builder().id(UUID.fromString("00001111-2222-3333-4444-555566667777")).build())
				.addressType(AddressType.builder().name("addressType1").build())
				.city("city")
				.street("street")
				.streetNumber("streetNumber")
				.block("block")
				.floor(2)
				.apartment("apartment")
				.isPrimary(true)
				.build();

		addressMapper.updateEntity(entity, dto, AddressType.builder().name("addressType1").build());

		assertEquals(expectedEntity, entity);
	}
}
