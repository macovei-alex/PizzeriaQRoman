package ro.pizzeriaq.qservices.unit.entities;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.PushToken;
import ro.pizzeriaq.qservices.repositories.PushTokenRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
@Rollback
class PushTokenConstraintsTest {

	@Value("${app.environment}")
	String environment;

	@Autowired
	PushTokenRepository pushTokenRepository;
	@Autowired
	EntityInitializerService entityInitializerService;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL);
		RepositoryTestConfig.addDynamicProperties(registry);
	}


	@BeforeAll
	void setUp() {
		log.info("Environment: {}", environment);
		EntityInitializerService.reInitializeEntities(entityInitializerService);
	}

	@AfterAll
	void tearDown() {
		entityInitializerService.deleteAll();
	}


	private PushToken buildValidPushToken() {
		return new PushToken("token-" + LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
	}


	@Test
	void validPushToken() {
		var saved = pushTokenRepository.save(buildValidPushToken());
		assertNotNull(saved);
		assertNotNull(saved.getId());
	}

	@Test
	void idNull() {
		var token = new PushToken(null);
		assertThrows(JpaSystemException.class, () -> pushTokenRepository.saveAndFlush(token));
	}

	@Test
	void duplicateId() {
		var token1 = buildValidPushToken();
		var token2 = buildValidPushToken();
		token2.setId(token1.getId());

		pushTokenRepository.saveAndFlush(token1);
		assertDoesNotThrow(() -> pushTokenRepository.saveAndFlush(token2));
	}

	@Test
	void updateId() {
		var token = pushTokenRepository.saveAndFlush(buildValidPushToken());
		token.setId("new-id");
		assertThrows(JpaSystemException.class, () -> pushTokenRepository.saveAndFlush(token));
	}
}

