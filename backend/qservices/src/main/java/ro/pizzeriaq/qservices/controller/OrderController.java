package ro.pizzeriaq.qservices.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.DTO.OrderDTO;
import ro.pizzeriaq.qservices.service.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController {

	private final OrderService orderService;


	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}


	@PostMapping("/place")
	public ResponseEntity<?> placeOrder(@RequestBody OrderDTO orderDTO) {
		try {
			orderService.placeOrder(orderDTO);
			return ResponseEntity.ok().build();

		} catch (IllegalArgumentException e) {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(e.getMessage());
		}
	}
}
