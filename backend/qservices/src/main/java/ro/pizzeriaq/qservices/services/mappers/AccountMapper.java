package ro.pizzeriaq.qservices.services.mappers;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.data.dtos.UpdateAccountDto;
import ro.pizzeriaq.qservices.data.dtos.KeycloakUpdateAccountDto;

@Component
public class AccountMapper {

	public Account toAccount(KeycloakUser user) {
		if (user == null) {
			return null;
		}

		return Account.builder()
				.id(user.id())
				.email(user.email())
				.isEmailVerified(user.emailVerified())
				.phoneNumber(null)
				.createdAt(user.createdTimestampDate())
				.isActive(true)
				.build();
	}


	public KeycloakUpdateAccountDto toKeycloakAccountUpdateDto(UpdateAccountDto updateAccountDto) {
		if (updateAccountDto == null) {
			return null;
		}

		return new KeycloakUpdateAccountDto(
				updateAccountDto.firstName(),
				updateAccountDto.lastName(),
				updateAccountDto.email()
		);
	}

}
