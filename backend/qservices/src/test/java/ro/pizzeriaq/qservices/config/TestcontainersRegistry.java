package ro.pizzeriaq.qservices.config;

import dasniko.testcontainers.keycloak.KeycloakContainer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.MySQLContainer;

import java.util.Map;
import java.util.function.Consumer;

@Slf4j
public abstract class TestcontainersRegistry {

	private TestcontainersRegistry() {
	}


	private static final MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
			.withCreateContainerCmdModifier(cmd -> cmd.withName("qs-testcontainer-mysql"))
			.withDatabaseName("pizzeriaq-test")
			.withUsername("test")
			.withPassword("test")
			.withReuse(true);

	private static final KeycloakContainer keycloakContainer = new KeycloakContainer()
			.withCreateContainerCmdModifier(cmd -> cmd.withName("qs-testcontainer-keycloak"))
			.withRealmImportFile("pizzeriaq-realm-export.json")
			.withContextPath("/pizzeriaq/auth")
			.withReuse(true);


	private static final Map<Container, Consumer<DynamicPropertyRegistry>> startFunctions = Map.of(
			Container.MySQL, TestcontainersRegistry::startMySqlContainer,
			Container.Keycloak, TestcontainersRegistry::startKeycloakContainer
	);


	public static void start(DynamicPropertyRegistry registry, Container... containers) {
		for (var container : containers) {
			var startFunction = startFunctions.get(container);
			if (startFunction != null) {
				startFunction.accept(registry);
			}
		}
	}


	private static void startMySqlContainer(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
		registry.add("spring.datasource.username", mysqlContainer::getUsername);
		registry.add("spring.datasource.password", mysqlContainer::getPassword);
		log.info("Added MySQL test container properties");

		try {
			if (!mysqlContainer.isRunning()) {
				mysqlContainer.start();
				log.info("Started MySQL test container");
			}
		} catch (Exception e) {
			log.error("Failed to start MySQL test container: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	private static void startKeycloakContainer(DynamicPropertyRegistry registry) {
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

		try {
			if (!keycloakContainer.isRunning()) {
				keycloakContainer.start();
				log.info("Started Keycloak test container");
			}
		} catch (Exception e) {
			log.error("Failed to start Keycloak test container: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

}
