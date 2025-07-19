package ro.pizzeriaq.qservices.unit.data.dtos;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import ro.pizzeriaq.qservices.config.BaseDtoTest;
import ro.pizzeriaq.qservices.data.dtos.SendPushNotificationRequestDto;

import static org.junit.jupiter.api.Assertions.*;

public class SendPushNotificationRequestDtoTest extends BaseDtoTest {

	@ParameterizedTest
	@ValueSource(strings = {
			"""
					{
					  "title": null,
					  "body": "Valid body"
					}
					""",
			"""
					{
					  "title": "Valid title",
					  "body": null
					}
					""",
			"""
					{
					  "title": "  ",
					  "body": "Body"
					}
					""",
			"""
					{
					  "title": "Title",
					  "body": "   "
					}
					"""
	})
	void invalidBy1Violation(String json) throws Exception {
		var dto = objectMapper.readValue(json, SendPushNotificationRequestDto.class);
		var violations = validator.validate(dto);
		assertEquals(1, violations.size());
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"""
				{
				  "title": "Important",
				  "body": "Please read this message"
				}
				"""
	})
	void valid(String json) throws Exception {
		var dto = objectMapper.readValue(json, SendPushNotificationRequestDto.class);
		var violations = validator.validate(dto);
		assertTrue(violations.isEmpty());
	}
}
