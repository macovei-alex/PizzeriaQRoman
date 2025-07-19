package ro.pizzeriaq.qservices.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class BaseDtoTest {

	protected ObjectMapper objectMapper;


	public BaseDtoTest() {
		objectMapper = new ObjectMapper();
		objectMapper.enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES);
	}

}
