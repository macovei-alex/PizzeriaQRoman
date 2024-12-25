package ro.pizzeriaq.qservices.unit.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.service.DTO.OptionDTO;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class OptionDTOTest {

	@Test
	void entityNull() {
		assertNull(OptionDTO.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> OptionDTO.fromEntity(Option.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> OptionDTO.fromEntity(Option.builder()
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

		assertEquals(expected, OptionDTO.fromEntity(option));
	}
}
