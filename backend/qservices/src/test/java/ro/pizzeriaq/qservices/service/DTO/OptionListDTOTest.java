package ro.pizzeriaq.qservices.service.DTO;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class OptionListDTOTest {

	@Test
	void entityNull() {
		assert (OptionListDTO.fromEntity(null) == null);
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> OptionListDTO.fromEntity(OptionList.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> OptionListDTO.fromEntity(OptionList.builder()
				.id(null).build()));
		assertThrows(NullPointerException.class, () -> OptionListDTO.fromEntity(OptionList.builder()
				.id(1).options(null).build()));
		assertThrows(NullPointerException.class, () -> OptionListDTO.fromEntity(OptionList.builder()
				.id(1).options(List.of(Option.builder().id(null).build())).build()));
	}

	@Test
	void entityValid() {
		OptionList optionList = OptionList.builder()
				.id(10)
				.text("Pizza")
				.options(List.of())
				.build();

		OptionListDTO expected = OptionListDTO.builder()
				.id(10)
				.text("Pizza")
				.options(List.of())
				.build();

		assertEquals(expected, OptionListDTO.fromEntity(optionList));
	}
}
