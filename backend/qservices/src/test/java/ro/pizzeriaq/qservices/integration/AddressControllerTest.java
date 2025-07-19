package ro.pizzeriaq.qservices.integration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.dtos.CreateAddressDto;
import ro.pizzeriaq.qservices.services.AddressService;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.utils.MockUserService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class AddressControllerTest {

	@Value("${server.servlet.context-path}")
	String contextPath;
	@Value("${app.environment}")
	String environment;

	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	AddressService addressService;
	@Autowired
	MockUserService mockUserService;
	@Autowired
	ObjectMapper objectMapper;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL, Container.Keycloak);
	}


	MockHttpServletRequestBuilder createDefaultGetRequest(UUID accountId) {
		return get(contextPath + "/accounts/" + accountId + "/addresses")
				.contextPath(contextPath)
				.contentType(MediaType.APPLICATION_JSON);
	}

	MockHttpServletRequestBuilder createDefaultPostRequest(UUID accountId) {
		return post(contextPath + "/accounts/" + accountId + "/addresses")
				.contextPath(contextPath)
				.contentType(MediaType.APPLICATION_JSON);
	}

	MockHttpServletRequestBuilder createDefaultDeleteRequest(UUID accountId, int addressId) {
		return delete(contextPath + "/accounts/" + accountId + "/addresses/" + addressId)
				.contextPath(contextPath)
				.contentType(MediaType.APPLICATION_JSON);
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
	void contextLoads() {
		assertThat(mockMvc).isNotNull();
	}

	@Test
	void entitiesInitialization() throws Exception {
		assertThat(
				addressService.getAddressesForAccount(mockUserService.getDynamicAccountIdWithPhoneNumber())
		).isNotEmpty();
	}

	@Test
	void unauthorizedAccess() throws Exception {
		mockMvc.perform(createDefaultGetRequest(UUID.randomUUID()))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getAddresses() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var addresses = addressService.getAddressesForAccount(accountId);

			mockMvc.perform(createDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(addresses.size()))
					.andExpect(jsonPath("$")
							.value(objectMapper.convertValue(
									addresses,
									new TypeReference<List<Map<String, Object>>>() {
									})
							));
		});
	}

	@Test
	void createAddressBadPayload() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {

			mockMvc.perform(createDefaultPostRequest(accountId).content(""))
					.andExpect(status().isBadRequest());

			mockMvc.perform(createDefaultPostRequest(accountId).content("{}"))
					.andExpect(status().isBadRequest());

			mockMvc.perform(createDefaultPostRequest(accountId).content("{\"addressString\": null, isPrimary: false}"))
					.andExpect(status().isBadRequest());

			mockMvc.perform(createDefaultPostRequest(accountId).content("{\"addressString\": \"\", isPrimary: false}"))
					.andExpect(status().isBadRequest());

			mockMvc.perform(createDefaultPostRequest(accountId)
							.content("{\"addressString\": \"address\", isPrimary: \"notBoolean\"}"))
					.andExpect(status().isBadRequest());

			mockMvc.perform(createDefaultPostRequest(accountId)
							.content("{\"addressString\": \"address\", isPrimary: null}"))
					.andExpect(status().isBadRequest());

		});
	}

	@Test
	void createAddress() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var initialAddresses = addressService.getAddressesForAccount(accountId);
			var newAddress = new CreateAddressDto("address", false);

			mockMvc.perform(createDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsBytes(newAddress))
					)
					.andExpect(status().isOk());

			assertEquals(initialAddresses.size() + 1, addressService.getAddressesForAccount(accountId).size());
		});
	}

	@Test
	void deleteAddress() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var initialAddresses = addressService.getAddressesForAccount(accountId);
			assertThat(initialAddresses).isNotEmpty();

			mockMvc.perform(createDefaultDeleteRequest(accountId, initialAddresses.get(0).id()))
					.andExpect(status().isOk());

			assertEquals(initialAddresses.size() - 1, addressService.getAddressesForAccount(accountId).size());
		});
	}
}
