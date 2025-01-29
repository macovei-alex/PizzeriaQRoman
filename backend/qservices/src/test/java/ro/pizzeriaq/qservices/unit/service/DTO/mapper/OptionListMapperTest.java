package ro.pizzeriaq.qservices.unit.service.DTO.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.OptionListMapper;
import ro.pizzeriaq.qservices.service.DTO.mapper.OptionMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class OptionListMapperTest {

	private OptionListMapper optionListMapper;


	@BeforeEach
	void setup() {
		if (optionListMapper == null) {
			OptionMapper optionMapper = new OptionMapper();
			optionListMapper = new OptionListMapper(optionMapper);
		}
		assertNotNull(optionListMapper);
	}


	@Test
	void entityNull() {
		assertNull(optionListMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.id(null).build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.id(1).options(null).build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
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

		assertEquals(expected, optionListMapper.fromEntity(optionList));
	}
}
