package ro.pizzeriaq.qservices.integration;

import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import ro.pizzeriaq.qservices.service.EntityInitializerService;
import ro.pizzeriaq.qservices.service.ProductCategoryService;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class ProductCategoryControllerTest {

	private static final Logger logger = LoggerFactory.getLogger(ProductControllerTest.class);


	@Value("${server.servlet.context-path}")
	private String contextPath;

	@Value("${app.environment}")
	private String environment;


	@Autowired
	private EntityInitializerService entityInitializerService;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ProductCategoryService productCategoryService;


	@BeforeAll
	void setup() {
		logger.info("Environment: {}", environment);

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
		mockMvc.perform(get(contextPath + "/category/all"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockUser
	void getCategories() throws Exception {
		mockMvc.perform(get(contextPath + "/category/all")
						.contextPath(contextPath))
				.andExpect(status().isOk());
	}
}
