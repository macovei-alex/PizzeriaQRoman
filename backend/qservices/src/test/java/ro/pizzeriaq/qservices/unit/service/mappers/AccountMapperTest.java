package ro.pizzeriaq.qservices.unit.service.mappers;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.service.DTO.AccountDto;
import ro.pizzeriaq.qservices.service.DTO.KeycloakAccountUpdateDto;
import ro.pizzeriaq.qservices.service.mappers.AccountMapper;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class AccountMapperTest {

	private final AccountMapper accountMapper = new AccountMapper();


	@Test
	void fromNull() {
		assertNull(accountMapper.toAccount(null));
		assertNull(accountMapper.toKeycloakAccountUpdateDto(null));
	}

	@Test
	void toKeycloakAccountUpdateDto() {
		var accountDto = new AccountDto("firstName", "lastName", "email", "phoneNumber");
		var expectedKeycloakAccountUpdateDto = new KeycloakAccountUpdateDto(
				accountDto.firstName(),
				accountDto.lastName(),
				accountDto.email()
		);

		assertEquals(expectedKeycloakAccountUpdateDto, accountMapper.toKeycloakAccountUpdateDto(accountDto));
	}

	@Test
	void toAccount() {
		var keycloakUser = new KeycloakUser(
				UUID.randomUUID(),
				"username",
				"firstName",
				"lastName",
				"email",
				true,
				LocalDateTime.now().toEpochSecond(ZoneOffset.UTC) * 1000,
				true,
				true,
				null,
				null,
				(int) LocalDateTime.now().toEpochSecond(ZoneOffset.UTC),
				new KeycloakUser.Access(true)
		);
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
