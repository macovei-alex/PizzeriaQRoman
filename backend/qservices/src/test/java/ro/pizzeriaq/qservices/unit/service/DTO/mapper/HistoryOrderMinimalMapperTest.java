package ro.pizzeriaq.qservices.unit.service.DTO.mapper;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.model.Order;
import ro.pizzeriaq.qservices.data.model.OrderItem;
import ro.pizzeriaq.qservices.data.model.OrderStatus;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;
import ro.pizzeriaq.qservices.service.DTO.mapper.HistoryOrderMinimalMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class HistoryOrderMinimalMapperTest {

	private final HistoryOrderMinimalMapper historyOrderMinimalMapper = new HistoryOrderMinimalMapper();


	OrderItem nullOrderItem() {
		return null;
	}

	@Test
	void entityNull() {
		assertNull(historyOrderMinimalMapper.fromEntity(null));
	}

	@Test
	void throwCases() {
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(null)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of())
				.build()));
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(null)
				.orderItems(List.of())
				.build()));
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(null)
				.build()));
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of(nullOrderItem()))
				.build()));
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of(OrderItem.builder().product(null).count(1).build()))
				.build()));
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of(OrderItem.builder().product(null).count(1).build()))
				.build()));
		assertThrows(NullPointerException.class, () -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of(OrderItem.builder().product(Product.builder().id(null).build()).count(1).build()))
				.build()));
	}

	@Test
	void minimalValidCases() {
		assertDoesNotThrow(() -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of())
				.build()));
		assertDoesNotThrow(() -> historyOrderMinimalMapper.fromEntity(Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of(OrderItem.builder().product(Product.builder().id(1).build()).count(1).build()))
				.build()));
	}

	@Test
	void entityValid1() {
		Order order = Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of())
				.build();

		HistoryOrderMinimalDTO expected = HistoryOrderMinimalDTO.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED.name())
				.orderTimestamp(null)
				.deliveryTimestamp(null)
				.estimatedPreparationTime(null)
				.additionalNotes(null)
				.totalPrice(null)
				.totalPriceWithDiscount(null)
				.items(List.of())
				.build();

		assertEquals(expected, historyOrderMinimalMapper.fromEntity(order));
	}

	@Test
	void entityValid2() {
		Order order = Order.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED)
				.orderItems(List.of(
						OrderItem.builder().product(Product.builder().id(1).build()).count(1).build(),
						OrderItem.builder().product(Product.builder().id(2).build()).count(2).build()
				))
				.build();

		HistoryOrderMinimalDTO expected = HistoryOrderMinimalDTO.builder()
				.id(1)
				.orderStatus(OrderStatus.RECEIVED.name())
				.orderTimestamp(null)
				.deliveryTimestamp(null)
				.estimatedPreparationTime(null)
				.additionalNotes(null)
				.totalPrice(null)
				.totalPriceWithDiscount(null)
				.items(List.of(
						HistoryOrderMinimalDTO.Item.builder().productId(1).count(1).build(),
						HistoryOrderMinimalDTO.Item.builder().productId(2).count(2).build()
				))
				.build();

		assertEquals(expected, historyOrderMinimalMapper.fromEntity(order));
	}

	@Test
	void entityValid3() {
		Order order = Order.builder()
				.id(1)
				.orderStatus(OrderStatus.DELIVERED)
				.orderTimestamp(LocalDateTime.of(2000, 1, 1, 0, 0))
				.deliveryTimestamp(LocalDateTime.of(2000, 1, 1, 0, 0))
				.estimatedPreparationTime(45)
				.additionalNotes("some additional notes here")
				.totalPrice(BigDecimal.valueOf(100.0))
				.totalPriceWithDiscount(BigDecimal.valueOf(90.0))
				.orderItems(List.of(
						OrderItem.builder().product(Product.builder().id(1).build()).count(1).build(),
						OrderItem.builder().product(Product.builder().id(2).build()).count(2).build()
				))
				.build();

		HistoryOrderMinimalDTO expected = HistoryOrderMinimalDTO.builder()
				.id(1)
				.orderStatus(OrderStatus.DELIVERED.name())
				.orderTimestamp(LocalDateTime.of(2000, 1, 1, 0, 0))
				.deliveryTimestamp(LocalDateTime.of(2000, 1, 1, 0, 0))
				.estimatedPreparationTime(45)
				.additionalNotes("some additional notes here")
				.totalPrice(BigDecimal.valueOf(100.0))
				.totalPriceWithDiscount(BigDecimal.valueOf(90.0))
				.items(List.of(
						HistoryOrderMinimalDTO.Item.builder().productId(1).count(1).build(),
						HistoryOrderMinimalDTO.Item.builder().productId(2).count(2).build()
				))
				.build();

		assertEquals(expected, historyOrderMinimalMapper.fromEntity(order));
	}
}
