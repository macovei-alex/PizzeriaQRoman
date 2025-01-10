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
class ProductTests {

	@Value("${server.servlet.context-path}")
	private String contextPath;


	@Autowired
	private EntityInitializerService entityInitializerService;

	@Autowired
	private ProductService productService;

	@Autowired
	private MockMvc mockMvc;


	@BeforeAll
	void setUp() {
		entityInitializerService.deleteAll();
		entityInitializerService.addProducts();
		entityInitializerService.addOptionLists();
		entityInitializerService.bindOptionsToProducts();
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
	void testGetAllProducts() throws Exception {
		mockMvc.perform(get(contextPath + "/product/all")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(8));
	}

	@Test
	void testGetNonexistentProduct() throws Exception {
		mockMvc.perform(get(contextPath + "/product/{id}", Integer.MAX_VALUE)
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());
	}

	@Test
	void testGetProductWithWrongRoute() throws Exception {
		mockMvc.perform(get(contextPath + "/product/invalid")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
	}

	@Test
	void getProductWithValidId() throws Exception {
		var product = productService.getProduct(
						productService.getProducts()
								.stream()
								.sorted(Comparator.comparing(ProductDTO::getName))
								.toList()
								.get(2)
								.getId())
				.orElse(null);

		assertThat(product).isNotNull();

		mockMvc.perform(get(contextPath + "/product/{id}", product.getId())
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(product.getId()))
				.andExpect(jsonPath("$.name").value("Pizza Capriciosa"))
				.andExpect(jsonPath("$.optionLists").isArray())
				.andExpect(jsonPath("$.optionLists.length()").value(3));
	}
}
