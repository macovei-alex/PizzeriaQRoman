package ro.pizzeriaq.qservices.data.model;

import lombok.NonNull;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

public record KeycloakUser(
		UUID id,
		String username,
		String firstName,
		String lastName,
		String email,
		boolean emailVerified,
		long createdTimestamp,
		boolean enabled,
		boolean totp,
		String[] disableableCredentialTypes,
		String[] requiredActions,
		int notBefore,
		Access access
) {
	public record Access(boolean manage) {
	}


	public LocalDateTime createdTimestampDate() {
		return LocalDateTime.ofEpochSecond(createdTimestamp / 1000, 0, ZoneOffset.UTC);
	}


	@Override
	@NonNull
	public String toString() {
		return "KeycloakUser{" +
				"id=" + id +
				", username='" + username + '\'' +
				", firstName='" + firstName + '\'' +
				", lastName='" + lastName + '\'' +
				", email='" + email + '\'' +
				", emailVerified=" + emailVerified +
				", createdTimestamp=" + createdTimestamp +
				", enabled=" + enabled +
				", totp=" + totp +
				", disableableCredentialTypes=" + String.join(", ", disableableCredentialTypes) +
				", requiredActions=" + String.join(", ", requiredActions) +
				", notBefore=" + notBefore +
				", access=Access{manage=" + access.manage() +
				"}}";
	}
}
