package ro.pizzeriaq.qservices.integration;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.EntityInitializerService;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.Comparator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
class ProductControllerTest {

	private static final Logger logger = LoggerFactory.getLogger(ProductControllerTest.class);


	@Value("${server.servlet.context-path}")
	private String contextPath;

	@Value("${app.environment}")
	private String environment;


	@Autowired
	private EntityInitializerService entityInitializerService;

	@Autowired
	private ProductService productService;

	@Autowired
	private MockMvc mockMvc;


	@BeforeAll
	void setUp() {
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
		assertThat(productService.getProducts()).isNotEmpty();
	}

	@Test
	void unauthorizedAccess() throws Exception {
		mockMvc.perform(get(contextPath + "/products")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(get(contextPath + "/products/{id}", 1)
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockUser
	void getAllProducts() throws Exception {
		mockMvc.perform(get(contextPath + "/products")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(8));
	}

	@Test
	@WithMockUser
	void getNonexistentProduct() throws Exception {
		mockMvc.perform(get(contextPath + "/products/{id}", Integer.MAX_VALUE)
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());
	}

	@Test
	@WithMockUser
	void getProductWithWrongRoute() throws Exception {
		mockMvc.perform(get(contextPath + "/products/invalid")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void getProductWithValidIdAndOptionLists1() throws Exception {
		var productId = productService.getProducts().stream()
				.sorted(Comparator.comparing(ProductDTO::getName))
				.filter((p) -> p.getName().equals("Pizza Capriciosa"))
				.findFirst()
				.orElseThrow()
				.getId();
		var product = productService.getProduct(productId).orElseThrow();

		mockMvc.perform(get(contextPath + "/products/{id}", product.getId())
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(product.getId()))
				.andExpect(jsonPath("$.name").value("Pizza Capriciosa"))
				.andExpect(jsonPath("$.optionLists").isArray())
				.andExpect(jsonPath("$.optionLists.length()").value(3));
	}

	@Test
	@WithMockUser
	void getProductWithValidIdAndOptionLists2() throws Exception {
		var productId = productService.getProducts().stream()
				.sorted(Comparator.comparing(ProductDTO::getName))
				.filter((p) -> p.getName().equals("Pizza Margherita"))
				.findFirst()
				.orElseThrow()
				.getId();
		var product = productService.getProduct(productId).orElseThrow();

		mockMvc.perform(get(contextPath + "/products/{id}", product.getId())
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(product.getId()))
				.andExpect(jsonPath("$.name").value("Pizza Margherita"))
				.andExpect(jsonPath("$.optionLists").isArray())
				.andExpect(jsonPath("$.optionLists.length()").value(2));
	}

	@Test
	@WithMockUser
	void getProductWithValidIdAndNoOptionLists1() throws Exception {
		var productId = productService.getProducts().stream()
				.filter((p) -> p.getName().equals("Pizza Quattro Stagioni"))
				.findFirst()
				.orElseThrow()
				.getId();
		var product = productService.getProduct(productId).orElseThrow();

		mockMvc.perform(get(contextPath + "/products/{id}", product.getId())
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(product.getId()))
				.andExpect(jsonPath("$.name").value("Pizza Quattro Stagioni"))
				.andExpect(jsonPath("$.optionLists").isArray())
				.andExpect(jsonPath("$.optionLists.length()").value(0));
	}

	@Test
	@WithMockUser
	void getProductWithValidIdAndNoOptionLists2() throws Exception {
		var productId = productService.getProducts().stream()
				.filter((p) -> p.getName().equals("Pizza Quattro Formaggi"))
				.findFirst()
				.orElseThrow()
				.getId();
		var product = productService.getProduct(productId).orElseThrow();

		mockMvc.perform(get(contextPath + "/products/{id}", product.getId())
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(product.getId()))
				.andExpect(jsonPath("$.name").value("Pizza Quattro Formaggi"))
				.andExpect(jsonPath("$.optionLists").isArray())
				.andExpect(jsonPath("$.optionLists.length()").value(0));
	}
}
