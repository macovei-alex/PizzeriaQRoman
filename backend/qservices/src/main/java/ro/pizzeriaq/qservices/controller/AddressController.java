package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.AddressService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/account/{accountId}/address")
@AllArgsConstructor
public class AddressController {

	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);


	private final AccountService accountService;
	private final AddressService addressService;
	private final AuthenticationInsightsService authenticationInsightsService;


	@GetMapping
	public ResponseEntity<List<AddressDto>> getAddresses(@PathVariable UUID accountId) {
		if (!authenticationInsightsService.isIdSameAs(accountId) && !authenticationInsightsService.isAdmin()) {
			logger.error("User ( {} ) is not authorized to access addresses of user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			return ResponseEntity.status(403).build();
		}
		return ResponseEntity.ok(accountService.getAddresses(accountId));
	}


	@PutMapping("{addressId}")
	public ResponseEntity<AddressDto> updateAddress(
			@PathVariable UUID accountId,
			@PathVariable int addressId,
			@RequestBody AddressDto address
	) {
		if (!authenticationInsightsService.isIdSameAs(accountId)) {
			logger.error("User ( {} ) is not authorized to update address of user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			return ResponseEntity.status(403).build();
		}
		var updatedAddress = addressService.updateAddress(addressId, address);
		return ResponseEntity.ok().body(updatedAddress);
	}


	@PostMapping
	public ResponseEntity<AddressDto> createAddress(@PathVariable UUID accountId, @RequestBody AddressDto address) {
		if (!authenticationInsightsService.isIdSameAs(accountId)) {
			logger.error("User ( {} ) is not authorized to create an address for user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			return ResponseEntity.status(403).build();
		}
		var createdAddress = addressService.createAddress(accountId, address);
		return ResponseEntity.ok().body(createdAddress);
	}


	@DeleteMapping("{addressId}")
	public ResponseEntity<Void> deleteAddress(@PathVariable UUID accountId, @PathVariable int addressId) {
		if (!authenticationInsightsService.isIdSameAs(accountId)) {
			logger.error("User ( {} ) is not authorized to delete address of user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			return ResponseEntity.status(403).build();
		}
		addressService.deleteAddress(addressId);
		return ResponseEntity.noContent().build();
	}
}
