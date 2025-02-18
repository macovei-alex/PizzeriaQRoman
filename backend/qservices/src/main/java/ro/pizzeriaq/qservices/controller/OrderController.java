package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;


	@PostMapping("/place")
	public void placeOrder(@Valid @RequestBody PlacedOrderDTO placedOrderDTO) {
		orderService.placeOrder(placedOrderDTO);
	}


	@GetMapping("/history")
	public List<HistoryOrderMinimalDTO> getOrdersHistory() {
		return orderService.getOrdersHistory();
	}
}
