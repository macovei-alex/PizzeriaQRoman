package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.dtos.AddressDto;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderFullDto;
import ro.pizzeriaq.qservices.data.entities.*;
import ro.pizzeriaq.qservices.services.mappers.AddressMapper;
import ro.pizzeriaq.qservices.services.mappers.HistoryOrderFullMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class HistoryOrderFullMapperTest {

	final AddressMapper addressMapper = mock(AddressMapper.class);
	final HistoryOrderFullMapper historyOrderFullMapper = new HistoryOrderFullMapper(addressMapper);

	final Address address = Address.builder().id(1).addressString("address").build();
	final AddressDto addressDto = AddressDto.builder().id(1).addressString("address").build();


	Order nullOrder() {
		return null;
	}

	OrderItem nullOrderItem() {
		return null;
	}

	Address nullAddress() {
		return null;
	}

	Order.OrderBuilder minimalValidOrderBuilder() {
		return Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.address(address)
				.orderItems(List.of())
				.totalPrice(BigDecimal.ONE)
				.totalPriceWithDiscount(BigDecimal.ONE)
				.orderTimestamp(LocalDateTime.now());
	}


	@Test
	void throwCases() {
		when(addressMapper.fromEntity(nullAddress())).thenThrow(NullPointerException.class);
		when(addressMapper.fromEntity(address)).thenReturn(addressDto);

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(nullOrder()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.id(null).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.orderStatus(null).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.address(nullAddress()).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.orderItems(null).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.orderItems(List.of(nullOrderItem())).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.orderItems(List.of(OrderItem.builder()
						.id(null)
						.product(Product.builder().id(1).build())
						.count(1)
						.build())
				)
				.build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.orderItems(List.of(OrderItem.builder()
						.id(1)
						.product(Product.builder().id(null).build())
						.count(1)
						.build()
				))
				.build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.totalPrice(null).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.totalPriceWithDiscount(null).build()));

		assertThrows(NullPointerException.class, () -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder()
				.orderTimestamp(null).build()));
	}

	@Test
	void minimalValidCase() {
		when(addressMapper.fromEntity(address)).thenReturn(addressDto);

		assertDoesNotThrow(() -> historyOrderFullMapper.fromEntity(minimalValidOrderBuilder().build()));
	}

	@Test
	void fullEntityMapping() {
		when(addressMapper.fromEntity(address)).thenReturn(addressDto);

		var option1 = OrderItem_OptionList_Option.builder()
				.option(Option.builder().id(10).build())
				.optionList(OptionList.builder().id(100).build())
				.count(1)
				.build();

		var option2 = OrderItem_OptionList_Option.builder()
				.option(Option.builder().id(20).build())
				.optionList(OptionList.builder().id(200).build())
				.count(2)
				.build();

		var item1 = OrderItem.builder()
				.id(1)
				.count(2)
				.product(Product.builder().id(1).build())
				.options(List.of(option1))
				.build();

		var item2 = OrderItem.builder()
				.id(2)
				.count(3)
				.product(Product.builder().id(2).build())
				.options(List.of(option2))
				.build();

		var order = Order.builder()
				.id(123)
				.orderStatus(OrderStatus.DELIVERED)
				.orderTimestamp(LocalDateTime.of(2022, 12, 1, 10, 0))
				.deliveryTimestamp(LocalDateTime.of(2022, 12, 1, 11, 0))
				.estimatedPreparationTime(40)
				.additionalNotes("Leave at door")
				.totalPrice(BigDecimal.valueOf(50.00))
				.totalPriceWithDiscount(BigDecimal.valueOf(45.00))
				.address(address)
				.orderItems(List.of(item1, item2))
				.build();

		var expected = HistoryOrderFullDto.builder()
				.id(123)
				.orderStatus(OrderStatus.DELIVERED.name())
				.orderTimestamp(LocalDateTime.of(2022, 12, 1, 10, 0))
				.deliveryTimestamp(LocalDateTime.of(2022, 12, 1, 11, 0))
				.estimatedPreparationTime(40)
				.additionalNotes("Leave at door")
				.totalPrice(BigDecimal.valueOf(50.00))
				.totalPriceWithDiscount(BigDecimal.valueOf(45.00))
				.address(addressDto)
				.items(List.of(
						HistoryOrderFullDto.Item.builder()
								.id(1)
								.productId(1)
								.count(2)
								.options(List.of(
										HistoryOrderFullDto.Item.Option.builder()
												.optionId(10)
												.optionListId(100)
												.count(1)
												.build()
								))
								.build(),
						HistoryOrderFullDto.Item.builder()
								.id(2)
								.productId(2)
								.count(3)
								.options(List.of(
										HistoryOrderFullDto.Item.Option.builder()
												.optionId(20)
												.optionListId(200)
												.count(2)
												.build()
								))
								.build()
				))
				.build();

		var actual = historyOrderFullMapper.fromEntity(order);
		assertEquals(expected, actual);
	}
}
