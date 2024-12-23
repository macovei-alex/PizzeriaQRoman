package ro.pizzeriaq.qservices.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class OptionDTOTest {

	@Test
	void entityNull() {
		assert (OptionDTO.fromEntity(null) == null);
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
