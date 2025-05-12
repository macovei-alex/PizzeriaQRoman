package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entity.Option;
import ro.pizzeriaq.qservices.data.entity.OptionList;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;
import ro.pizzeriaq.qservices.service.mappers.OptionListMapper;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class OptionListMapperTest {

	private final OptionListMapper optionListMapper = new OptionListMapper();


	Option nullOption() {
		return null;
	}

	@Test
	void entityNull() {
		assertNull(optionListMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder().build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.id(null)
				.options(List.of())
				.build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.id(1)
				.options(null)
				.build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.id(1)
				.options(List.of(nullOption()))
				.build()));
		assertThrows(NullPointerException.class, () -> optionListMapper.fromEntity(OptionList.builder()
				.id(1)
				.options(List.of(Option.builder().id(null).build()))
				.build()));
	}

	@Test
	void minimalNotThrowCases() {
		assertDoesNotThrow(() -> optionListMapper.fromEntity(OptionList.builder()
				.id(1)
				.options(List.of())
				.build()));
		assertDoesNotThrow(() -> optionListMapper.fromEntity(OptionList.builder()
				.id(1)
				.options(List.of(Option.builder().id(1).build()))
				.build()));
	}

	@Test
	void entityValid1() {
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


	@Test
	void entityValid2() {
		OptionList optionList = OptionList.builder()
				.id(10)
				.text("Pizza")
				.options(List.of(
						Option.builder().id(1).name("option1").build(),
						Option.builder().id(2).name("option2").build()
				))
				.build();

		OptionListDTO expected = OptionListDTO.builder()
				.id(10)
				.text("Pizza")
				.options(List.of(
						OptionListDTO.Option.builder().id(1).name("option1").build(),
						OptionListDTO.Option.builder().id(2).name("option2").build()
				))
				.build();

		assertEquals(expected, optionListMapper.fromEntity(optionList));
	}


	@Test
	void entityValid3() {
		OptionList optionList = OptionList.builder()
				.id(10)
				.text("Pizza")
				.options(List.of(
						Option.builder()
								.id(1)
								.name("option1")
								.additionalDescription("description1")
								.minCount(2)
								.maxCount(3)
								.price(BigDecimal.valueOf(10.0))
								.build(),
						Option.builder()
								.id(2)
								.name("option2")
								.additionalDescription("description2")
								.minCount(10)
								.maxCount(20)
								.price(BigDecimal.valueOf(100.0))
								.build()
				))
				.build();

		OptionListDTO expected = OptionListDTO.builder()
				.id(10)
				.text("Pizza")
				.options(List.of(
						OptionListDTO.Option.builder()
								.id(1)
								.name("option1")
								.additionalDescription("description1")
								.minCount(2)
								.maxCount(3)
								.price(BigDecimal.valueOf(10.0))
								.build(),
						OptionListDTO.Option.builder()
								.id(2)
								.name("option2")
								.additionalDescription("description2")
								.minCount(10)
								.maxCount(20)
								.price(BigDecimal.valueOf(100.0))
								.build()
				))
				.build();

		assertEquals(expected, optionListMapper.fromEntity(optionList));
	}
}
