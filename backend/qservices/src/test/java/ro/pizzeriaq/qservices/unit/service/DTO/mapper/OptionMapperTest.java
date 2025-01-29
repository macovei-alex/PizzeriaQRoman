package ro.pizzeriaq.qservices.unit.service.DTO.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.service.DTO.OptionDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.OptionMapper;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class OptionMapperTest {

	private OptionMapper optionMapper;


	@BeforeEach
	void setup() {
		if (optionMapper == null) {
			optionMapper = new OptionMapper();
		}
		assertNotNull(optionMapper);
	}


	@Test
	void entityNull() {
		assertNull(optionMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> optionMapper.fromEntity(Option.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> optionMapper.fromEntity(Option.builder()
				.id(null).build()));
	}

	@Test
	void entityValid() {
		Option option = Option.builder()
				.id(10)
				.name("Pizza")
				.price(BigDecimal.valueOf(2.0))
				.minCount(2)
				.maxCount(22)
				.build();

		OptionDTO expected = OptionDTO.builder()
				.id(10)
				.name("Pizza")
				.price(BigDecimal.valueOf(2.0))
				.minCount(2)
				.maxCount(22)
				.build();

		assertEquals(expected, optionMapper.fromEntity(option));
	}
}
