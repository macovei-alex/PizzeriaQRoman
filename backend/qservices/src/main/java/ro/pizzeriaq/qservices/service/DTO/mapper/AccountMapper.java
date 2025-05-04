package ro.pizzeriaq.qservices.service.DTO.mapper;

import org.springframework.stereotype.Component;
import ro.pizzeriaq.qservices.data.entity.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
public class AccountMapper {

	public Account fromKeycloakUser(KeycloakUser user) {
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
}
