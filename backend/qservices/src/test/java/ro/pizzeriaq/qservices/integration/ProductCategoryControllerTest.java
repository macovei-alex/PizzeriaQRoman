package ro.pizzeriaq.qservices.integration;

import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import ro.pizzeriaq.qservices.service.EntityInitializerService;
import ro.pizzeriaq.qservices.service.ProductCategoryService;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class ProductCategoryControllerTest {

	private static final Logger logger = LoggerFactory.getLogger(ProductControllerTest.class);


	@Value("${server.servlet.context-path}")
	private String contextPath;

	@Value("${application.environment}")
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
}
