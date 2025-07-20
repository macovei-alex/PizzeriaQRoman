package ro.pizzeriaq.qservices.config;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistry;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.repositories.*;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.KeycloakService;

import javax.naming.ServiceUnavailableException;
import java.util.ArrayList;
import java.util.UUID;

@TestConfiguration
public class RepositoryTestConfig {


	@Bean
	public EntityInitializerService entityInitializerService(
			ProductCategoryRepository productCategoryRepository,
			ProductRepository productRepository,
			OptionListRepository optionListRepository,
			OptionRepository optionRepository,
			AddressRepository addressRepository,
			AccountRepository accountRepository,
			OrderRepository orderRepository,
			OrderItemRepository orderItemRepository,
			OrderItem_OptionList_OptionRepository orderItem_OptionList_OptionRepository
	) {
		return new EntityInitializerService(
				productRepository,
				productCategoryRepository,
				optionListRepository,
				optionRepository,
				addressRepository,
				accountRepository,
				orderRepository,
				orderItemRepository,
				orderItem_OptionList_OptionRepository,
				keycloakService()
		);
	}


	@Bean
	public KeycloakService keycloakService() {
		var keycloakService = Mockito.mock(KeycloakService.class);

		try {
			var users = new ArrayList<KeycloakUser>();

			users.add(KeycloakUser.builder()
					.id(UUID.randomUUID())
					.username("u1")
					.firstName("f1")
					.lastName("l1")
					.email("e1")
					.emailVerified(true)
					.createdTimestamp(1000L)
					.enabled(true)
					.totp(true)
					.disableableCredentialTypes(new String[0])
					.requiredActions(new String[0])
					.notBefore(0)
					.access(new KeycloakUser.Access(false))
					.build()
			);

			users.add(KeycloakUser.builder()
					.id(UUID.randomUUID())
					.username("u2")
					.firstName("f2")
					.lastName("l2")
					.email("e2")
					.emailVerified(true)
					.createdTimestamp(2000L)
					.enabled(true)
					.totp(true)
					.disableableCredentialTypes(new String[0])
					.requiredActions(new String[0])
					.notBefore(0)
					.access(new KeycloakUser.Access(false))
					.build()
			);

			Mockito.when(keycloakService.getUsers()).thenReturn(users);

		} catch (ServiceUnavailableException e) {
			throw new RuntimeException(e);
		}

		return keycloakService;
	}


	public static void addDynamicProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.jpa.show-sql", () -> false);
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
	}

}
