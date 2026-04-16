package ro.pizzeriaq.qservices.config;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.json.JsonMapper;

public abstract class BaseDtoTest {

	protected JsonMapper jsonMapper;
	protected Validator validator = Validation.buildDefaultValidatorFactory().getValidator();


	public BaseDtoTest() {
		jsonMapper = JsonMapper.builder()
				.enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES)
				.build();
	}

}
