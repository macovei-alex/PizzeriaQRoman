package ro.pizzeriaq.qservices.config;

import dasniko.testcontainers.keycloak.KeycloakContainer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.MySQLContainer;

@Slf4j
public abstract class TestcontainersRegistry {

	private TestcontainersRegistry() {
	}


	private static final MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
			.withDatabaseName("pizzeriaq-test")
			.withUsername("test")
			.withPassword("test");

	private static final KeycloakContainer keycloakContainer = new KeycloakContainer()
			.withRealmImportFile("pizzeriaq-realm-export.json")
			.withContextPath("/pizzeriaq/auth");


	public static void startMySqlContainer(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
		registry.add("spring.datasource.username", mysqlContainer::getUsername);
		registry.add("spring.datasource.password", mysqlContainer::getPassword);
		log.info("Added MySQL test container properties");

		if (!mysqlContainer.isRunning()) {
			mysqlContainer.start();
			log.info("Started MySQL test container");
		}
	}

	public static void startKeycloakContainer(DynamicPropertyRegistry registry) {
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
		log.info("Added Keycloak test container properties");

		if (!keycloakContainer.isRunning()) {
			keycloakContainer.start();
			log.info("Started Keycloak test container");
		}
	}

}
