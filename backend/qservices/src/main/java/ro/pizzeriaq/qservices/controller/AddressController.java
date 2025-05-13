package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.exceptions.AccessDeniedException;
import ro.pizzeriaq.qservices.service.AddressService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;

import java.util.List;
import java.util.UUID;

// TODO: Address tests
@RestController
@RequestMapping("/accounts/{accountId}/addresses")
@AllArgsConstructor
public class AddressController {

	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);


	private final AddressService addressService;
	private final AuthenticationInsightsService authenticationInsightsService;


	@GetMapping
	public List<AddressDto> getAddresses(@PathVariable UUID accountId) {
		if (!authenticationInsightsService.isIdSameAs(accountId) && !authenticationInsightsService.isAdmin()) {
			logger.error("User ( {} ) is not authorized to access addresses of user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			throw new AccessDeniedException("User ( %s ) is not authorized to access addresses of user ( %s )"
					.formatted(authenticationInsightsService.getAuthenticationId(), accountId)
			);
		}
		return addressService.getAddressesForAccount(accountId);
	}


	@PutMapping("{addressId}")
	public AddressDto updateAddress(
			@PathVariable UUID accountId,
			@PathVariable int addressId,
			@RequestBody AddressDto address
	) {
		if (!authenticationInsightsService.isIdSameAs(accountId)) {
			logger.error("User ( {} ) is not authorized to update an address of user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			throw new AccessDeniedException("User ( %s ) is not authorized to update an address of user ( %s )"
					.formatted(authenticationInsightsService.getAuthenticationId(), accountId)
			);
		}
		return addressService.updateAddress(addressId, address);
	}


	@PostMapping
	public AddressDto createAddress(@PathVariable UUID accountId, @RequestBody AddressDto address) {
		if (!authenticationInsightsService.isIdSameAs(accountId)) {
			logger.error("User ( {} ) is not authorized to create an address for user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			throw new AccessDeniedException("User ( %s ) is not authorized to create an address for user ( %s )"
					.formatted(authenticationInsightsService.getAuthenticationId(), accountId)
			);
		}
		return addressService.createAddress(accountId, address);
	}


	@DeleteMapping("{addressId}")
	public void deleteAddress(@PathVariable UUID accountId, @PathVariable int addressId) {
		if (!authenticationInsightsService.isIdSameAs(accountId)) {
			logger.error("User ( {} ) is not authorized to delete address of user ( {} )",
					authenticationInsightsService.getAuthenticationId(),
					accountId
			);
			throw new AccessDeniedException("User ( %s ) is not authorized to delete an address of user ( %s )"
					.formatted(authenticationInsightsService.getAuthenticationId(), accountId)
			);
		}
		addressService.deleteAddress(addressId);
	}
}
