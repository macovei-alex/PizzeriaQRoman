package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderFullDto;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.OrderService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("accounts/{accountId}/orders")
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;


	@GetMapping
	@AccountIdChecked
	public List<HistoryOrderMinimalDTO> getOrdersHistory(
			@PathVariable UUID accountId,
			@RequestParam("page") int page,
			@RequestParam("pageSize") int pageSize
	) {
		// TODO: Test pagination.
		return orderService.getOrdersHistory(accountId, page, pageSize);
	}


	@GetMapping("{orderId}")
	@AccountIdChecked
	public HistoryOrderFullDto getOrderDetails(@PathVariable int orderId) {
		return orderService.getFullOrder(orderId);
	}


	@PostMapping
	@AccountIdChecked
	public void placeOrder(@PathVariable UUID accountId, @Valid @RequestBody PlacedOrderDTO placedOrderDTO) {
		orderService.placeOrder(placedOrderDTO, accountId);
	}
}
