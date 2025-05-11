package ro.pizzeriaq.qservices.data.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Authorities {

	ADMIN("admin"),
	USER("user");

	private final String name;
}
