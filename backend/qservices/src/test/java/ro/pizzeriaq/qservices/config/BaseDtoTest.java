package ro.pizzeriaq.qservices.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

public abstract class BaseDtoTest {

	protected ObjectMapper objectMapper;
	protected Validator validator = Validation.buildDefaultValidatorFactory().getValidator();


	public BaseDtoTest() {
		objectMapper = new ObjectMapper();
		objectMapper.enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES);
	}

}
