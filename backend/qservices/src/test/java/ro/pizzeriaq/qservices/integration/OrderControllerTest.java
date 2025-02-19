package ro.pizzeriaq.qservices.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.EntityInitializerService;
import ro.pizzeriaq.qservices.service.OrderService;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


// TODO: Add Validation message testing
// TODO: Add tests with orders with options


@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class OrderControllerTest {

	private static final Logger logger = LoggerFactory.getLogger(OrderControllerTest.class);


	@Value("${server.servlet.context-path}")
	private String contextPath;

	@Value("${application.environment}")
	private String environment;


	@Autowired
	private EntityInitializerService entityInitializerService;

	@Autowired
	private ProductService productService;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private OrderService orderService;


	private MockHttpServletRequestBuilder constructDefaultPostRequest() {
		return post(contextPath + "/order/place")
				.contextPath(contextPath)
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON);
	}

	private MockHttpServletRequestBuilder constructDefaultGetRequest() {
		return get(contextPath + "/order/history")
				.contextPath(contextPath)
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON);
	}


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
	void badPayloadTest1() throws Exception {
		mockMvc.perform(constructDefaultPostRequest())
				.andExpect(status().isInternalServerError());
	}

	@Test
	void badPayloadTest2() throws Exception {
		mockMvc.perform(constructDefaultPostRequest()
						.content(""))
				.andExpect(status().isInternalServerError());
	}

	@Test
	void badPayloadTest3() throws Exception {
		mockMvc.perform(constructDefaultPostRequest()
						.content("{}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadTest4() throws Exception {
		mockMvc.perform(constructDefaultPostRequest()
						.content("{\"nonexistentField\":  null}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadValidation1() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(null)
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadValidation2() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of())
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.['items']").value("The list of items in an order cannot be null or empty"));
	}

	@Test
	void badPayloadValidation3() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(
						PlacedOrderDTO.Item.builder().productId(0).count(1).optionLists(List.of()).build()))
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.['items[0].productId']").value("You cannot order a product with the ID less than or equal to 0"));
	}

	@Test
	void badPayloadValidation4() throws Exception {
		var productId = productService.getProducts().stream().findFirst().orElseThrow().getId();

		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(
						PlacedOrderDTO.Item.builder().productId(productId).count(0).optionLists(List.of()).build()))
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.['items[0].count']").value("You cannot order an amount of items less than or equal to 0"));
	}

	@Test
	void badPayloadValidation5() throws Exception {
		var productId = productService.getProducts().stream().findFirst().orElseThrow().getId();

		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(
						PlacedOrderDTO.Item.builder().productId(productId).count(1).optionLists(null).build()
				))
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.['items[0].optionLists']").value("The list of options for any item cannot be null, only empty if no options were selected"));
	}

	@Test
	void badPayloadDBValuesTest() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(
						PlacedOrderDTO.Item.builder().productId(Integer.MAX_VALUE).count(1).optionLists(List.of()).build()
				))
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void goodPayloadTest1() throws Exception {
		var productIds = productService.getProducts().stream().map(ProductDTO::getId).toList();

		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(
						PlacedOrderDTO.Item.builder().productId(productIds.get(0)).count(1).optionLists(List.of()).build(),
						PlacedOrderDTO.Item.builder().productId(productIds.get(1)).count(2).optionLists(List.of()).build()
				))
				.build();

		var historyOrders = orderService.getOrdersHistory();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isOk());

		mockMvc.perform(constructDefaultGetRequest())
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1));
	}

	@Test
	void goodPayloadTest2() throws Exception {
		var products = productService.getProducts();

		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(products.stream()
						.map(product -> PlacedOrderDTO.Item.builder()
								.productId(product.getId())
								.count(10)
								.optionLists(List.of())
								.build())
						.toList())
				.build();

		var historyOrders = orderService.getOrdersHistory();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isOk());

		mockMvc.perform(constructDefaultGetRequest())
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1));
	}
}
