package ro.pizzeriaq.qservices.config;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;

public abstract class TestcontainersBase {

	static final MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
			.withDatabaseName("pizzeriaq-test")
			.withUsername("test")
			.withPassword("test");


	static {
		mysqlContainer.start();
	}


	@DynamicPropertySource
	protected static void registerTestcontainers(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
		registry.add("spring.datasource.username", mysqlContainer::getUsername);
		registry.add("spring.datasource.password", mysqlContainer::getPassword);
	}

}
