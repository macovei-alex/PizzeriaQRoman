package ro.pizzeriaq.qservices.service.mappers;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.service.DTO.AccountDto;
import ro.pizzeriaq.qservices.service.DTO.KeycloakAccountUpdateDto;

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
				.phoneNumber("")
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
