package ro.pizzeriaq.qservices.unit.data.dtos;

import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import ro.pizzeriaq.qservices.config.BaseDtoTest;
import ro.pizzeriaq.qservices.data.dtos.CreateAddressDto;

import static org.junit.jupiter.api.Assertions.*;

public class CreateAddressDtoTest extends BaseDtoTest {

	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
						"addressString": "address"
					}
					""",
			"""
					{
						"addressString": "address",
						"isPrimary": null
					}
					"""
	})
	void deserializationErrors(String json) {
		assertThrows(MismatchedInputException.class, () ->
				objectMapper.readValue(json, CreateAddressDto.class)
		);
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
						"isPrimary": false
					}
					""",
			"""
					{
						"addressString": null,
						"isPrimary": false
					}
					""",
			"""
					{
						"addressString": "",
						"isPrimary": false
					}
					"""
	})
	void invalidBy1Violation(String json) throws Exception {
		var dto = objectMapper.readValue(json, CreateAddressDto.class);
		var violations = validator.validate(dto);

		assertEquals(1, violations.size());
	}


	@ParameterizedTest
	@ValueSource(strings = {
			"""
				   {
				    	"addressString": "address",
				   		"isPrimary": false
				   }
				"""
	})
	void valid(String json) throws Exception {
		var dto = objectMapper.readValue(json, CreateAddressDto.class);
		var violations = validator.validate(dto);

		assertTrue(violations.isEmpty());
	}

}
