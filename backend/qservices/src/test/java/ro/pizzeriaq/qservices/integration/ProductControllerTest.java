package ro.pizzeriaq.qservices.integration;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.IntegrationTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.dtos.ProductDto;
import ro.pizzeriaq.qservices.data.dtos.ProductWithOptionsDto;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.ProductService;
import ro.pizzeriaq.qservices.utils.MockUserService;

import java.util.function.Predicate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@IntegrationTestConfig
class ProductControllerTest {

	@Value("${server.servlet.context-path}")
	String contextPath;

	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	ProductService productService;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	MockUserService mockUserService;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL, Container.Keycloak);
	}


	@BeforeAll
	void setUp() {
		EntityInitializerService.reInitializeEntities(entityInitializerService);
	}

	@AfterAll
	void tearDown() {
		entityInitializerService.deleteAll();
	}


	ProductWithOptionsDto getProductByFilter(Predicate<ProductDto> predicate) {
		var productId = productService.getProducts().stream()
				.filter(predicate)
				.findFirst()
				.orElseThrow()
				.id();

		return productService.getProduct(productId);
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
	void getAllProducts() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products")
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk())
					.andExpect(content().contentType(MediaType.APPLICATION_JSON))
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(44));
		});
	}

	@Test
	void getNonexistentProduct() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products/{id}", Integer.MAX_VALUE)
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isNotFound());
		});
	}

	@Test
	void getProductWithWrongRoute() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products/invalid")
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isBadRequest());
		});
	}

	@Test
	void getProductWithValidIdAndOptionLists1() throws Exception {
		var product = getProductByFilter(
				(p) -> p.name().equals("Pizza Capriciosa") && p.subtitle().contains("1+1")
		);

		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products/{id}", product.id())
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk())
					.andExpect(content().contentType(MediaType.APPLICATION_JSON))
					.andExpect(jsonPath("$.id").value(product.id()))
					.andExpect(jsonPath("$.name").value("Pizza Capriciosa"))
					.andExpect(jsonPath("$.optionLists").isArray())
					.andExpect(jsonPath("$.optionLists.length()").value(7));
		});
	}

	@Test
	void getProductWithValidIdAndOptionLists2() throws Exception {
		var product = getProductByFilter(
				(p) -> p.name().equals("Pizza Margherita") && p.subtitle().contains("1+1")
		);

		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products/{id}", product.id())
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk())
					.andExpect(content().contentType(MediaType.APPLICATION_JSON))
					.andExpect(jsonPath("$.id").value(product.id()))
					.andExpect(jsonPath("$.name").value("Pizza Margherita"))
					.andExpect(jsonPath("$.optionLists").isArray())
					.andExpect(jsonPath("$.optionLists.length()").value(7));
		});
	}

	@Test
	void getProductWithValidIdAndNoOptionLists1() throws Exception {
		var product = getProductByFilter((p) -> p.name().equals("Coca-Cola"));

		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products/{id}", product.id())
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk())
					.andExpect(content().contentType(MediaType.APPLICATION_JSON))
					.andExpect(jsonPath("$.id").value(product.id()))
					.andExpect(jsonPath("$.name").value("Coca-Cola"))
					.andExpect(jsonPath("$.optionLists").isArray())
					.andExpect(jsonPath("$.optionLists.length()").value(0));
		});
	}

	@Test
	void getProductWithValidIdAndNoOptionLists2() throws Exception {
		var product = getProductByFilter((p) -> p.name().equals("Fanta"));

		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(get(contextPath + "/products/{id}", product.id())
							.contextPath(contextPath)
							.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk())
					.andExpect(content().contentType(MediaType.APPLICATION_JSON))
					.andExpect(jsonPath("$.id").value(product.id()))
					.andExpect(jsonPath("$.name").value("Fanta"))
					.andExpect(jsonPath("$.optionLists").isArray())
					.andExpect(jsonPath("$.optionLists.length()").value(0));
		});
	}
}
