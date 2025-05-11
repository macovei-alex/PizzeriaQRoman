package ro.pizzeriaq.qservices.service.DTO;

public record KeycloakAccountUpdateDto (
		String firstName,
		String lastName,
		String email
) { }
