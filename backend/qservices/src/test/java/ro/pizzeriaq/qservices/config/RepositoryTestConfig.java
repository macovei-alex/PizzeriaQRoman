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
			AddressTypeRepository addressTypeRepository,
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
				addressTypeRepository,
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
			users.add(new KeycloakUser(UUID.randomUUID(), "u1", "f1", "l1", "e1", true, 1000, true, true, new String[0], new String[0], 0, new KeycloakUser.Access(false)));
			users.add(new KeycloakUser(UUID.randomUUID(), "u2", "f2", "l2", "e2", true, 2000, true, true, new String[0], new String[0], 0, new KeycloakUser.Access(false)));

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
