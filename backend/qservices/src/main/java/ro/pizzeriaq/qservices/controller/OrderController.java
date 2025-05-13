package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
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


	@PostMapping
	public void placeOrder(@PathVariable UUID accountId, @Valid @RequestBody PlacedOrderDTO placedOrderDTO) {
		// TODO: use the accountId for the order
		orderService.placeOrder(placedOrderDTO, accountId);
	}


	@GetMapping
	public List<HistoryOrderMinimalDTO> getOrdersHistory(
			@PathVariable UUID accountId,
			@RequestParam("page") int page,
			@RequestParam("pageSize") int pageSize
	) {
		// TODO: Test pagination.
		return orderService.getOrdersHistory(accountId, page, pageSize);
	}
}
