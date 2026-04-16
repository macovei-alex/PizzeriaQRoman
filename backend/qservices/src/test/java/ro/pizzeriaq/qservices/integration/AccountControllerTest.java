package ro.pizzeriaq.qservices.integration;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.util.StringUtils;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.IntegrationTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.dtos.UpdateAccountDto;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.exceptions.KeycloakException;
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.services.AccountService;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.KeycloakService;
import ro.pizzeriaq.qservices.services.mappers.AccountMapper;
import ro.pizzeriaq.qservices.utils.MockUserService;
import tools.jackson.databind.json.JsonMapper;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@IntegrationTestConfig
@Import(AccountControllerTest.MockedBeansExtension.class)
public class AccountControllerTest {

	@TestConfiguration
	static class MockedBeansExtension {

		@Bean
		@Qualifier("mockedKeycloakService")
		KeycloakService mockedKeycloakService() {
			return mock(KeycloakService.class);
		}

		@Bean
		@Qualifier("accountServiceWithMockedKeycloak")
		AccountService accountServiceWithMockedKeycloak(
				AccountRepository accountRepository,
				AccountMapper accountMapper
		) {
			return new AccountService(accountRepository, accountMapper, mockedKeycloakService());
		}
	}


	@Value("${server.servlet.context-path}")
	String contextPath;

	@Autowired
	AccountRepository accountRepository;
	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	MockUserService mockUserService;
	@Autowired
	JsonMapper jsonMapper;
	@Autowired
	private KeycloakService keycloakService;
	@Autowired
	private AccountService accountService;

	@Autowired
	@Qualifier("mockedKeycloakService")
	KeycloakService mockedKeycloakService;
	@Autowired
	@Qualifier("accountServiceWithMockedKeycloak")
	AccountService accountServiceWithMockedKeycloak;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL, Container.Keycloak);
	}


	MockHttpServletRequestBuilder createGetPhoneNumberRequest(UUID accountId) {
		return get(contextPath + "/accounts/" + accountId + "/phone-number")
				.contextPath(contextPath)
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON);
	}

	MockHttpServletRequestBuilder createUpdateAccountRequest(UUID accountId) {
		return put(contextPath + "/accounts/" + accountId)
				.contextPath(contextPath)
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON);
	}

	UpdateAccountDto.UpdateAccountDtoBuilder createValidUpdateAccountDtoBuilder() {
		return UpdateAccountDto.builder()
				.firstName("first-name-" + UUID.randomUUID())
				.lastName("last-name-" + UUID.randomUUID())
				.email("email." + UUID.randomUUID() + "@example.com")
				.phoneNumber(UUID.randomUUID().toString().substring(0, 10));
	}

	KeycloakUser getKeycloakAccount(UUID accountId) {
		try {
			return keycloakService.getUsers().stream()
					.filter((k) -> accountId.equals(k.id()))
					.findFirst()
					.orElseThrow();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	void assertDidChange(UUID accountId, UpdateAccountDto updateAccountDto) {
		var newDbAccount = accountRepository.findActiveById(accountId).orElseThrow();
		var newKeycloakAccount = getKeycloakAccount(accountId);

		assertEquals(updateAccountDto.email(), newDbAccount.getEmail());
		assertEquals(updateAccountDto.phoneNumber(), newDbAccount.getPhoneNumber());

		assertEquals(updateAccountDto.firstName(), newKeycloakAccount.firstName());
		assertEquals(updateAccountDto.lastName(), newKeycloakAccount.lastName());
		assertEquals(updateAccountDto.email(), newKeycloakAccount.email());
	}

	void assertDidNotChange(Account oldDbAccount, KeycloakUser oldKeycloakAccount) {
		var newDbAccount = accountRepository.findActiveById(oldDbAccount.getId()).orElseThrow();
		var newKeycloakAccount = getKeycloakAccount(oldKeycloakAccount.id());

		assertEquals(oldDbAccount.getEmail(), newDbAccount.getEmail());
		assertEquals(oldDbAccount.getPhoneNumber(), newDbAccount.getPhoneNumber());

		assertEquals(oldKeycloakAccount.firstName(), newKeycloakAccount.firstName());
		assertEquals(oldKeycloakAccount.lastName(), newKeycloakAccount.lastName());
		assertEquals(oldKeycloakAccount.email(), newKeycloakAccount.email());
	}


	@BeforeAll
	void setUp() {
		EntityInitializerService.reInitializeEntities(entityInitializerService);
	}

	@AfterAll
	void tearDown() {
		entityInitializerService.deleteAll();
	}


	@Test
	void contextLoads() {
		assertThat(mockMvc).isNotNull();
	}

	@Test
	void entitiesInitialization() {
		assertThat(accountRepository.findAll()).isNotEmpty();
	}

	@Test
	void getPhoneNumber() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var expectedPhoneNumber = accountRepository.findActiveById(accountId)
					.orElseThrow()
					.getPhoneNumber();

			mockMvc.perform(createGetPhoneNumberRequest(accountId))
					.andExpect(status().is(200))
					.andExpect(content().string(expectedPhoneNumber));
		});
	}

	@Test
	void getPhoneNumberFromUserWithoutPhoneNumber() throws Exception {
		mockUserService.withDynamicMockUser(
				(a) -> !StringUtils.hasText(a.getPhoneNumber()),
				(accountId) -> mockMvc.perform(createGetPhoneNumberRequest(accountId))
						.andExpect(status().isNoContent())
						.andExpect(content().string(""))
		);
	}

	@Test
	void updateAccountValidPayload() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var updateAccountDto = createValidUpdateAccountDtoBuilder().build();

			mockMvc.perform(createUpdateAccountRequest(accountId)
							.content(jsonMapper.writeValueAsBytes(updateAccountDto))
					)
					.andExpect(status().isOk())
					.andExpect(content().string(""));

			accountRepository.flush();

			assertDidChange(accountId, updateAccountDto);
		});
	}

	@Test
	void updateAccountWithPhoneNumberTooLong() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var updateAccountDto = createValidUpdateAccountDtoBuilder()
					.phoneNumber("1".repeat(21))
					.build();

			var oldDbAccount = accountRepository.findActiveById(accountId).orElseThrow();
			var oldKeycloakAccount = getKeycloakAccount(accountId);

			mockMvc.perform(createUpdateAccountRequest(accountId)
							.content(jsonMapper.writeValueAsBytes(updateAccountDto))
					)
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.phoneNumber").value("Phone number cannot exceed 20 characters"));

			assertDidNotChange(oldDbAccount, oldKeycloakAccount);
		});
	}

	@Test
	void updateAccountWithEmailTooLong() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var updateAccountDto = createValidUpdateAccountDtoBuilder()
					.email("1".repeat(101))
					.build();

			var oldDbAccount = accountRepository.findActiveById(accountId).orElseThrow();
			var oldKeycloakAccount = getKeycloakAccount(accountId);

			mockMvc.perform(createUpdateAccountRequest(accountId)
							.content(jsonMapper.writeValueAsBytes(updateAccountDto))
					)
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.email").value("Email cannot exceed 100 characters"));

			assertDidNotChange(oldDbAccount, oldKeycloakAccount);
		});
	}

	@Test
	void updateAccountWithPhoneNumberTooLongAndFailureOnDbUpdate() {
		var accountId = mockUserService.getDynamicAccountIdWithPhoneNumber();

		var updateAccountDto = createValidUpdateAccountDtoBuilder()
				.phoneNumber("1".repeat(21))
				.build();

		var oldDbAccount = accountRepository.findActiveById(accountId).orElseThrow();
		var oldKeycloakAccount = getKeycloakAccount(accountId);

		assertThrows(DataIntegrityViolationException.class, () -> accountService.update(accountId, updateAccountDto));

		assertDidNotChange(oldDbAccount, oldKeycloakAccount);
	}

	@Test
	void updateAccountWithEmailTooLongAndFailureOnDbUpdate() {
		var accountId = mockUserService.getDynamicAccountIdWithPhoneNumber();

		var updateAccountDto = createValidUpdateAccountDtoBuilder()
				.email("1".repeat(101))
				.build();

		var oldDbAccount = accountRepository.findActiveById(accountId).orElseThrow();
		var oldKeycloakAccount = getKeycloakAccount(accountId);

		assertThrows(DataIntegrityViolationException.class, () -> accountService.update(accountId, updateAccountDto));

		assertDidNotChange(oldDbAccount, oldKeycloakAccount);
	}

	@Test
	void updateAccountWithFailureOnKeycloakSync() throws Exception {
		var accountId = mockUserService.getDynamicAccountIdWithPhoneNumber();

		var updateAccountDto = createValidUpdateAccountDtoBuilder().build();

		var oldDbAccount = accountRepository.findActiveById(accountId).orElseThrow();
		var oldKeycloakAccount = getKeycloakAccount(accountId);

		doThrow(new KeycloakException("Simulated failure for mocked bean"))
				.when(mockedKeycloakService)
				.updateUser(any(), any());

		assertThrows(KeycloakException.class, () -> accountServiceWithMockedKeycloak.update(accountId, updateAccountDto));

		assertDidNotChange(oldDbAccount, oldKeycloakAccount);
	}
}
