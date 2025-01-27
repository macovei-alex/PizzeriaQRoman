package ro.pizzeriaq.qservices.controller;

import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.DTO.HistoryOrderMinimalDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

	private final OrderService orderService;


	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}


	@PostMapping("/place")
	public void placeOrder(@RequestBody PlacedOrderDTO placedOrderDTO) {
		orderService.placeOrder(placedOrderDTO);
	}


	@GetMapping("/history")
	public List<HistoryOrderMinimalDTO> getOrdersHistory() {
		return orderService.getOrdersHistory();
	}
}
