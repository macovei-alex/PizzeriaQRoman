package ro.pizzeriaq.qservices.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.service.AddressService;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;
import ro.pizzeriaq.qservices.service.DTO.CreateAddressDto;

import java.util.List;
import java.util.UUID;

// TODO: Address tests
@RestController
@RequestMapping("/accounts/{accountId}/addresses")
@AllArgsConstructor
public class AddressController {

	private final AddressService addressService;


	@GetMapping
	@AccountIdChecked
	public List<AddressDto> getAddresses(@PathVariable UUID accountId) {
		return addressService.getAddressesForAccount(accountId);
	}


	@PostMapping
	@AccountIdChecked(allowAdmin = false)
	public AddressDto createAddress(@PathVariable UUID accountId, @Valid @RequestBody CreateAddressDto address) {
		return addressService.createAddress(accountId, address);
	}


	@DeleteMapping("{addressId}")
	@AccountIdChecked(allowAdmin = false)
	public void deleteAddress(@PathVariable int addressId) {
		addressService.deleteAddress(addressId);
	}
}
