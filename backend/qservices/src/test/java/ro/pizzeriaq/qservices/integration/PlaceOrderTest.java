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
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderItemDTO;
import ro.pizzeriaq.qservices.service.EntityInitializerService;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class PlaceOrderTest {

	private static final Logger logger = LoggerFactory.getLogger(PlaceOrderTest.class);


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
		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isInternalServerError());
	}

	@Test
	void badPayloadTest2() throws Exception {
		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content(""))
				.andExpect(status().isInternalServerError());
	}

	@Test
	void badPayloadTest3() throws Exception {
		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadTest4() throws Exception {
		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"nonexistentField\":  null}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadValidation1() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(null)
				.build();

		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadValidation2() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of())
				.build();

		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadValidation3() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(PlacedOrderItemDTO.builder().productId(0).count(1).build()))
				.build();

		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadValidation4() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(PlacedOrderItemDTO.builder().productId(1).count(0).build()))
				.build();

		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void badPayloadDBValuesTest() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(List.of(PlacedOrderItemDTO.builder().productId(Integer.MAX_VALUE).count(1).build()))
				.build();

		mockMvc.perform(post(contextPath + "/order/place")
						.contextPath(contextPath)
						.accept(MediaType.APPLICATION_JSON)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}
}
