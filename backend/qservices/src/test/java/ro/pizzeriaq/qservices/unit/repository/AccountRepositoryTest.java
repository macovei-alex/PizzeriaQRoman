package ro.pizzeriaq.qservices.unit.repository;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.RepositoryTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.IntStream;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(RepositoryTestConfig.class)
public class AccountRepositoryTest {

	@Value("app.environment")
	String environment;

	@Autowired
	AccountRepository accountRepository;
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


	@Test
	void findAllSorted() {
		var accounts = accountRepository.findAllActiveSortByCreatedAt();
		assertEquals(2, accounts.size());

		assertTrue(accounts.stream().allMatch(Account::isActive));
		assertTrue(IntStream.range(0, accounts.size() - 1)
				.allMatch((i) -> accounts.get(i).getCreatedAt().isBefore(accounts.get(i + 1).getCreatedAt()))
		);
	}

	@Test
	void existsAndFindById() {
		var accounts = accountRepository.findAllActiveSortByCreatedAt();
		assertEquals(2, accounts.size());

		assertTrue(accountRepository.existsActiveById(accounts.get(0).getId()));
		assertThat(accountRepository.findActiveById(accounts.get(0).getId())).isPresent();

		assertTrue(accountRepository.existsActiveById(accounts.get(1).getId()));
		assertThat(accountRepository.findActiveById(accounts.get(1).getId())).isPresent();

		assertFalse(accountRepository.existsActiveById(UUID.fromString("00000000-0000-0000-0000-000000000000")));
	}

	@Test
	@Rollback
	void updateConversationId() {
		var accounts = accountRepository.findAllActiveSortByCreatedAt();
		assertEquals(2, accounts.size());

		assertNull(accounts.get(0).getConversationId());
		assertNotNull(accounts.get(1).getConversationId());

		var newConvId = UUID.randomUUID();
		accounts.get(0).setConversationId(newConvId);

		var account = accountRepository.findActiveById(accounts.get(0).getId()).orElseThrow();
		assertEquals(newConvId, account.getConversationId());
	}

	@Test
	@Rollback
	void createAccount() {
		var accounts = accountRepository.findAllActiveSortByCreatedAt();
		assertEquals(2, accounts.size());

		var account = Account.builder()
				.id(UUID.randomUUID())
				.email("new-user@email.com")
				.isEmailVerified(false)
				.phoneNumber("0770 777 777")
				.createdAt(LocalDateTime.now())
				.build();
		accountRepository.saveAndFlush(account);

		accounts = accountRepository.findAllActiveSortByCreatedAt();
		assertEquals(3, accounts.size());

		var dbAccount = accountRepository.findActiveById(account.getId()).orElseThrow();
		assertEquals(account.getId(), dbAccount.getId());
		assertEquals(account.getEmail(), dbAccount.getEmail());
		assertFalse(dbAccount.isEmailVerified());
		assertEquals(account.getPhoneNumber(), dbAccount.getPhoneNumber());
		assertEquals(account.getCreatedAt(), dbAccount.getCreatedAt());
		assertTrue(dbAccount.isActive());
	}

}
