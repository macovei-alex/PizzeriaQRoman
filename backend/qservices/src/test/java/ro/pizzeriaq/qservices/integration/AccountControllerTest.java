package ro.pizzeriaq.qservices.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import ro.pizzeriaq.qservices.repositories.AccountRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.KeycloakService;
import ro.pizzeriaq.qservices.utils.MockUserService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@IntegrationTestConfig
public class AccountControllerTest {

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
	ObjectMapper objectMapper;
	@Autowired
	private KeycloakService keycloakService;


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
	void updateAccount() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var updateAccountDto = UpdateAccountDto.builder()
					.firstName("updated first name" + UUID.randomUUID())
					.lastName("updated last name" + UUID.randomUUID())
					.email("email." + UUID.randomUUID() + "@example.com")
					.phoneNumber(UUID.randomUUID().toString().substring(0, 10))
					.build();

			mockMvc.perform(createUpdateAccountRequest(accountId)
							.content(objectMapper.writeValueAsBytes(updateAccountDto))
					)
					.andExpect(status().isOk())
					.andExpect(content().string(""));

			accountRepository.flush();
			var newApiAccount = accountRepository.findActiveById(accountId).orElseThrow();
			var newKeycloakAccount = keycloakService.getUsers().stream()
					.filter((k) -> accountId.equals(k.id()))
					.findFirst()
					.orElseThrow();

			assertEquals(updateAccountDto.email(), newApiAccount.getEmail());
			assertEquals(updateAccountDto.phoneNumber(), newApiAccount.getPhoneNumber());

			assertEquals(updateAccountDto.firstName(), newKeycloakAccount.firstName());
			assertEquals(updateAccountDto.lastName(), newKeycloakAccount.lastName());
			assertEquals(updateAccountDto.email(), newKeycloakAccount.email());
		});
	}

	@Test
	void updateAccountWithPhoneNumberTooLong() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var updateAccountDto = UpdateAccountDto.builder()
					.firstName("updated first name" + UUID.randomUUID())
					.lastName("updated last name" + UUID.randomUUID())
					.email("email." + UUID.randomUUID() + "@example.com")
					.phoneNumber(UUID.randomUUID().toString())
					.build();

			mockMvc.perform(createUpdateAccountRequest(accountId)
							.content(objectMapper.writeValueAsBytes(updateAccountDto))
					)
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.phoneNumber").value("Phone number cannot exceed 20 characters"));

			var newKeycloakAccount = keycloakService.getUsers().stream()
					.filter((k) -> accountId.equals(k.id()))
					.findFirst()
					.orElseThrow();

			assertNotEquals(updateAccountDto.firstName(), newKeycloakAccount.firstName());
			assertNotEquals(updateAccountDto.phoneNumber(), newKeycloakAccount.lastName());
			assertNotEquals(updateAccountDto.email(), newKeycloakAccount.email());
		});
	}

}
