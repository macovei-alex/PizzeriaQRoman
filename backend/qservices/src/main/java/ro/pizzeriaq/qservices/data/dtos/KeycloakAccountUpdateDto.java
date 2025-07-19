package ro.pizzeriaq.qservices.data.dtos;

public record KeycloakAccountUpdateDto(
		String firstName,
		String lastName,
		String email
) {
}
