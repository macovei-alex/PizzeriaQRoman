package ro.pizzeriaq.qservices.services.mappers;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.data.dtos.AccountDto;
import ro.pizzeriaq.qservices.data.dtos.KeycloakAccountUpdateDto;

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


	public KeycloakAccountUpdateDto toKeycloakAccountUpdateDto(AccountDto accountDto) {
		if (accountDto == null) {
			return null;
		}

		return new KeycloakAccountUpdateDto(
				accountDto.firstName(),
				accountDto.lastName(),
				accountDto.email()
		);
	}

}
