package ro.pizzeriaq.qservices.unit.dtos;

import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import ro.pizzeriaq.qservices.config.BaseDtoTest;
import ro.pizzeriaq.qservices.data.dtos.PlaceOrderDto;

import static org.junit.jupiter.api.Assertions.*;

public class PlaceOrderDtoTest extends BaseDtoTest {

	@ParameterizedTest
	@ValueSource(strings = {
			// Null primitives: addressId
			"""
					{
						"clientExpectedPrice": 10.0,
						"items": [
							{
								"productId": 1,
								"count": 1,
								"optionLists": []
							}
						]
					}
					""",
			// Null primitive: productId
			"""
					{
						"clientExpectedPrice": 10.0,
						"addressId": 1,
						"items": [
							{
								"count": 1,
								"optionLists": []
							}
						]
					}
					""",
			// Null primitive: count
			"""
					{
						"clientExpectedPrice": 10.0,
						"addressId": 1,
						"items": [
							{
								"productId": 1,
								"optionLists": []
							}
						]
					}
					""",
	})
	void deserializationErrors(String json) {
		assertThrows(MismatchedInputException.class, () ->
				objectMapper.readValue(json, PlaceOrderDto.class)
		);
	}

	@ParameterizedTest
	@ValueSource(strings = {
			// Empty items list
			"""
					{
						"clientExpectedPrice": 15.0,
						"addressId": 1,
						"items": []
					}
					""",
			// Option list with empty options
			"""
					{
						"clientExpectedPrice": 20.0,
						"addressId": 1,
						"items": [
							{
								"productId": 1,
								"count": 1,
								"optionLists": [
									{
										"optionListId": 1,
										"options": []
									}
								]
							}
						]
					}
					"""
	})
	void invalidBy1Violation(String json) throws Exception {
		var dto = objectMapper.readValue(json, PlaceOrderDto.class);
		var violations = validator.validate(dto);
		assertEquals(1, violations.size());
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
					  "clientExpectedPrice": 1,
					  "addressId": 1,
					  "items": [
					    {
					      "productId": 0,
					      "count": 0,
					      "optionLists": [
					        {
					          "optionListId": 0,
					          "options": [
					            {
					              "optionId": 0,
					              "count": 0
					            }
					          ]
					        }
					      ]
					    }
					  ]
					}
					"""
	})
	void invalidByMultipleViolations(String json) throws Exception {
		var dto = objectMapper.readValue(json, PlaceOrderDto.class);
		var violations = validator.validate(dto);
		assertEquals(5, violations.size());
	}


	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
						"clientExpectedPrice": 10.0,
						"addressId": 1,
						"items": [
							{
								"productId": 1,
								"count": 1,
								"optionLists": []
							}
						]
					}
					""",
			"""
					{
						"clientExpectedPrice": 10.0,
						"addressId": 1,
						"items": [
							{
								"productId": 1,
								"count": 1,
								"optionLists": [
									{
										"optionListId": 1,
										"options": [
											{
												"optionId": 1,
												"count": 1
											}
										]
									}
								]
							}
						]
					}
					"""
	})
	void valid(String json) throws Exception {
		var dto = objectMapper.readValue(json, PlaceOrderDto.class);
		var violations = validator.validate(dto);
		assertTrue(violations.isEmpty());
	}
}

