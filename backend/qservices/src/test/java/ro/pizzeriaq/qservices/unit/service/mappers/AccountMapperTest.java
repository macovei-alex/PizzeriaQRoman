package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.dtos.UpdateAccountDto;
import ro.pizzeriaq.qservices.data.dtos.KeycloakUpdateAccountDto;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.services.mappers.AccountMapper;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class AccountMapperTest {

	final AccountMapper accountMapper = new AccountMapper();


	@Test
	void fromNull() {
		assertNull(accountMapper.toAccount(null));
		assertNull(accountMapper.toKeycloakAccountUpdateDto(null));
	}

	@Test
	void toKeycloakAccountUpdateDto() {
		var accountDto = new UpdateAccountDto("firstName", "lastName", "email", "phoneNumber");
		var expectedKeycloakAccountUpdateDto = new KeycloakUpdateAccountDto(
				accountDto.firstName(),
				accountDto.lastName(),
				accountDto.email()
		);

		assertEquals(expectedKeycloakAccountUpdateDto, accountMapper.toKeycloakAccountUpdateDto(accountDto));
	}

	@Test
	void toAccount() {
		var keycloakUser = KeycloakUser.builder()
				.id(UUID.randomUUID())
				.username("username")
				.firstName("firstName")
				.lastName("lastName")
				.email("email")
				.emailVerified(true)
				.createdTimestamp(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC) * 1000)
				.enabled(true)
				.totp(true)
				.disableableCredentialTypes(null)
				.requiredActions(null)
				.notBefore((int) LocalDateTime.now().toEpochSecond(ZoneOffset.UTC))
				.access(new KeycloakUser.Access(true))
				.build();
		var expectedAccount = Account.builder()
				.id(keycloakUser.id())
				.email(keycloakUser.email())
				.isEmailVerified(keycloakUser.emailVerified())
				.phoneNumber(null)
				.createdAt(keycloakUser.createdTimestampDate())
				.isActive(true)
				.build();

		assertEquals(expectedAccount, accountMapper.toAccount(keycloakUser));
	}

}
