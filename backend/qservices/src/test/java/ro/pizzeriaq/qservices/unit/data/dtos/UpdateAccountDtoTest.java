package ro.pizzeriaq.qservices.unit.data.dtos;

import com.fasterxml.jackson.core.JsonProcessingException;
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
	void invalidBy1Violation(String json) throws JsonProcessingException {
		var dto = objectMapper.readValue(json, UpdateAccountDto.class);
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
	void valid(String json) throws JsonProcessingException {
		var dto = objectMapper.readValue(json, UpdateAccountDto.class);
		var violations = validator.validate(dto);
		assertTrue(violations.isEmpty());
	}
}
