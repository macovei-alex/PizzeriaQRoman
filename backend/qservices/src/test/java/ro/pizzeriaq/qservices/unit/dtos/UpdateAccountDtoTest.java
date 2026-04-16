package ro.pizzeriaq.qservices.unit.dtos;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import ro.pizzeriaq.qservices.config.BaseDtoTest;
import ro.pizzeriaq.qservices.data.dtos.UpdateAccountDto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UpdateAccountDtoTest extends BaseDtoTest {

	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
					  "firstName": "",
					  "lastName": "Doe",
					  "email": "john@example.com",
					  "phoneNumber": "123456789"
					}
					""",
			"""
					{
					  "firstName": "John",
					  "lastName": " ",
					  "email": "john@example.com",
					  "phoneNumber": "123456789"
					}
					""",
			"""
					{
					  "firstName": "John",
					  "lastName": "Doe",
					  "email": "",
					  "phoneNumber": "123456789"
					}
					""",
			"""
					{
					  "firstName": "John",
					  "lastName": "Doe",
					  "email": "john@example.com",
					  "phoneNumber": "   "
					}
					"""
	})
	void invalidBy1Violation(String json) {
		var dto = jsonMapper.readValue(json, UpdateAccountDto.class);
		var violations = validator.validate(dto);
		assertEquals(1, violations.size());
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
					  "firstName": "John",
					  "lastName": "Doe",
					  "email": "john@example.com",
					  "phoneNumber": "123456789"
					}
					"""
	})
	void valid(String json) {
		var dto = jsonMapper.readValue(json, UpdateAccountDto.class);
		var violations = validator.validate(dto);
		assertTrue(violations.isEmpty());
	}

	@Test
	void validAccountToTheLimit() {
		var dto = UpdateAccountDto.builder()
				.firstName("John")
				.lastName("Doe")
				.email("a".repeat(100))
				.phoneNumber("1".repeat(2))
				.build();
		var violations = validator.validate(dto);
		assertTrue(violations.isEmpty());
	}

	@Test
	void phoneNumberTooLong() {
		var dto = UpdateAccountDto.builder()
				.firstName("John")
				.lastName("Doe")
				.email("john@doe.com")
				.phoneNumber("1".repeat(21))
				.build();
		var violations = validator.validate(dto);
		assertEquals(1, violations.size());
	}

	@Test
	void emailTooLong() {
		var dto = UpdateAccountDto.builder()
				.firstName("John")
				.lastName("Doe")
				.email("a".repeat(101))
				.phoneNumber("1".repeat(20))
				.build();
		var violations = validator.validate(dto);
		assertEquals(1, violations.size());
	}
}
