package ro.pizzeriaq.qservices.unit.entities;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.DataJpaTestConfig;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.repositories.AccountRepository;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTestConfig
public class AccountConstraintsTest {

	@Value("{app.environment}")
	String environment;

	@Autowired
	AccountRepository accountRepository;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL);
		RepositoryTestConfig.addDynamicProperties(registry);
	}


	@BeforeAll
	void setUp() {
		log.info("Environment: {}", environment);
	}


	private Account buildValidAccount() {
		return Account.builder()
				.id(UUID.randomUUID())
				.createdAt(LocalDateTime.now())
				.email("a".repeat(50))
				.isEmailVerified(true)
				.isActive(true)
				.build();
	}


	@Test
	void validAccount() {
		var account = buildValidAccount();
		var saved = accountRepository.save(account);
		assertNotNull(saved);
		assertEquals(account.getId(), saved.getId());
		assertTrue(saved.isActive());
	}

	@Test
	void idNull() {
		var account = buildValidAccount();
		account.setId(null);

		assertThrows(JpaSystemException.class, () -> accountRepository.saveAndFlush(account));
	}

	@Test
	void updateId() {
		var saved = accountRepository.saveAndFlush(buildValidAccount());
		saved.setId(UUID.randomUUID());

		assertThrows(JpaSystemException.class, () -> accountRepository.saveAndFlush(saved));
	}

	@Test
	void createdAtNull() {
		Account account = buildValidAccount();
		account.setCreatedAt(null);

		assertThrows(DataIntegrityViolationException.class, () -> accountRepository.saveAndFlush(account));
	}

	@Test
	void emailNull() {
		Account account = buildValidAccount();
		account.setEmail(null);

		assertThrows(DataIntegrityViolationException.class, () -> accountRepository.saveAndFlush(account));
	}

	@Test
	void emailTooLong() {
		Account account = buildValidAccount();
		account.setEmail("a".repeat(51));

		assertThrows(DataIntegrityViolationException.class, () -> accountRepository.saveAndFlush(account));
	}

	@Test
	void phoneNumberNull() {
		var account = buildValidAccount();
		account.setPhoneNumber(null);

		var saved = accountRepository.saveAndFlush(account);
		assertNotNull(saved);
		assertNull(saved.getPhoneNumber());
	}

	@Test
	void phoneNumberTooLong() {
		Account account = buildValidAccount();
		account.setPhoneNumber("1".repeat(21));

		assertThrows(DataIntegrityViolationException.class, () -> accountRepository.saveAndFlush(account));
	}

	@Test
	void isActiveDefaultTrue() {
		Account account = Account.builder()
				.id(UUID.randomUUID())
				.email("")
				.createdAt(LocalDateTime.now())
				.build();

		var saved = accountRepository.saveAndFlush(account);
		assertNotNull(saved);
		assertTrue(saved.isActive());
	}

}