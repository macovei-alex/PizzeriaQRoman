package ro.pizzeriaq.qservices.data.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@AllArgsConstructor
@Getter
public class KeycloakUser {

	private UUID id;
	private String username;
	private String firstName;
	private String lastName;
	private String email;
	private boolean emailVerified;
	private long createdTimestamp;
	private boolean enabled;
	private boolean totp;
	private String[] disableableCredentialTypes;
	private String[] requiredActions;
	private int notBefore;
	private Access access;


	@AllArgsConstructor
	@Getter
	public static class Access {
		private boolean manage;
	}

}
