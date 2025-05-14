package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.service.AddressService;
import ro.pizzeriaq.qservices.service.DTO.AddressDto;

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
	public AddressDto createAddress(@PathVariable UUID accountId, @RequestBody AddressDto address) {
		return addressService.createAddress(accountId, address);
	}


	@PutMapping("{addressId}")
	@AccountIdChecked(allowAdmin = false)
	public AddressDto updateAddress(@PathVariable int addressId, @RequestBody AddressDto address) {
		return addressService.updateAddress(addressId, address);
	}


	@DeleteMapping("{addressId}")
	@AccountIdChecked(allowAdmin = false)
	public void deleteAddress(@PathVariable int addressId) {
		addressService.deleteAddress(addressId);
	}
}
