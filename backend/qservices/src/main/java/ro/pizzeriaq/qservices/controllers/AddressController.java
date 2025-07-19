package ro.pizzeriaq.qservices.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.services.AddressService;
import ro.pizzeriaq.qservices.data.dtos.AddressDto;
import ro.pizzeriaq.qservices.data.dtos.CreateAddressDto;

import java.util.List;
import java.util.UUID;

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
