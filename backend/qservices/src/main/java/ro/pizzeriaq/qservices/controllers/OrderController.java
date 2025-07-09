package ro.pizzeriaq.qservices.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderFullDto;
import ro.pizzeriaq.qservices.data.dtos.HistoryOrderMinimalDto;
import ro.pizzeriaq.qservices.data.dtos.PlacedOrderDto;
import ro.pizzeriaq.qservices.services.OrderService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("accounts/{accountId}/orders")
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;


	@GetMapping
	@AccountIdChecked
	public List<HistoryOrderMinimalDto> getOrdersHistory(
			@PathVariable UUID accountId,
			@RequestParam("page") int page,
			@RequestParam("pageSize") int pageSize
	) {
		// TODO: Test pagination.
		return orderService.getOrdersHistory(accountId, page, pageSize);
	}


	@GetMapping("{orderId}")
	@AccountIdChecked
	public HistoryOrderFullDto getOrderDetails(@PathVariable UUID accountId, @PathVariable int orderId) {
		return orderService.getFullOrder(orderId, accountId);
	}


	@PostMapping
	@AccountIdChecked
	public void placeOrder(@PathVariable UUID accountId, @Valid @RequestBody PlacedOrderDto placedOrderDTO) {
		orderService.placeOrder(placedOrderDTO, accountId);
	}
}
