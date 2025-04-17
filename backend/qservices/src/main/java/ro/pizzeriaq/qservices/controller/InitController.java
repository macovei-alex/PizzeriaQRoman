package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.EntityInitializerService;

@RestController
@RequestMapping("/internal")
@AllArgsConstructor
public class InitController {

	private final EntityInitializerService entityInitializerService;


	@PostMapping("/initialize")
	public ResponseEntity<Void> initializeEntities() {
		try {
			EntityInitializerService.reInitializeEntities(entityInitializerService);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}
}