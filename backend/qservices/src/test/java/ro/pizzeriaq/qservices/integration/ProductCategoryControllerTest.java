package ro.pizzeriaq.qservices.integration;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.ProductCategoryService;
import ro.pizzeriaq.qservices.utils.MockUserService;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class ProductCategoryControllerTest {

	@Value("${server.servlet.context-path}")
	String contextPath;
	@Value("${app.environment}")
	String environment;

	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	ProductCategoryService productCategoryService;
	@Autowired
	MockUserService mockUserService;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL, Container.Keycloak);
	}


	@BeforeAll
	void setup() {
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
	void entitiesInitializationTest() {
		assertThat(productCategoryService.getCategories()).isNotEmpty();
	}

	@Test
	void unauthorizedAccess() throws Exception {
		mockMvc.perform(get(contextPath + "/categories"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getCategories() throws Exception {
		mockUserService.withDynamicMockUser((_) -> {
			mockMvc.perform(get(contextPath + "/categories")
							.contextPath(contextPath))
					.andExpect(status().isOk());
		});
	}
}
