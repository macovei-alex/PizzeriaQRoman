package ro.pizzeriaq.qservices.config;

import dasniko.testcontainers.keycloak.KeycloakContainer;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;

public abstract class TestcontainersBase {

	static final MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
			.withDatabaseName("pizzeriaq-test")
			.withUsername("test")
			.withPassword("test");

	static final KeycloakContainer keycloakContainer = new KeycloakContainer()
			.withRealmImportFile("pizzeriaq-realm-export.json")
			.withContextPath("/pizzeriaq/auth");


	static {
		mysqlContainer.start();
		keycloakContainer.start();
	}


	@DynamicPropertySource
	protected static void registerMySqlContainer(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
		registry.add("spring.datasource.username", mysqlContainer::getUsername);
		registry.add("spring.datasource.password", mysqlContainer::getPassword);
	}


	@DynamicPropertySource
	protected static void registerKeycloakContainer(DynamicPropertyRegistry registry) {
		registry.add("keycloak.base-url", keycloakContainer::getAuthServerUrl);
		registry.add("keycloak.realm", () -> "pizzeriaq");
		registry.add(
				"spring.security.oauth2.resourceserver.jwt.issuer-uri",
				() -> "%s/realms/pizzeriaq".formatted(keycloakContainer.getAuthServerUrl())
		);
		registry.add(
				"spring.security.oauth2.client.registration.keycloak.client-secret",
				() -> "**********"
		);
		registry.add(
				"spring.security.oauth2.client.provider.keycloak.issuer-uri",
				() -> "%s/realms/pizzeriaq".formatted(keycloakContainer.getAuthServerUrl())
		);
	}

}
