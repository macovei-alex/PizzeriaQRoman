package ro.pizzeriaq.qservices.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.util.MultiValueMap;
import ro.pizzeriaq.qservices.data.dtos.OptionListDto;
import ro.pizzeriaq.qservices.data.dtos.PlacedOrderDto;
import ro.pizzeriaq.qservices.data.dtos.ProductDto;
import ro.pizzeriaq.qservices.data.entities.OrderStatus;
import ro.pizzeriaq.qservices.repositories.AddressRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.OrderService;
import ro.pizzeriaq.qservices.services.ProductService;
import ro.pizzeriaq.qservices.utils.MockUserService;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@Slf4j
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class OrderControllerTest {

	@Value("${server.servlet.context-path}")
	String contextPath;
	@Value("${app.environment}")
	String environment;

	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	ProductService productService;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	OrderService orderService;
	@Autowired
	AddressRepository addressRepository;
	@Autowired
	MockUserService mockUserService;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.startMySqlContainer(registry);
		TestcontainersRegistry.startKeycloakContainer(registry);
	}


	MockHttpServletRequestBuilder constructDefaultPostRequest(UUID accountId) {
		return post(contextPath + "/accounts/" + accountId + "/orders")
				.contextPath(contextPath)
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON);
	}

	MockHttpServletRequestBuilder constructDefaultGetRequest(UUID accountId) {
		return get(contextPath + "/accounts/" + accountId + "/orders")
				.params(MultiValueMap.fromSingleValue(Map.of("page", "0", "pageSize", "100")))
				.contextPath(contextPath)
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON);
	}


	@BeforeAll
	void setUp() {
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
	void entitiesInitialization() {
		assertThat(productService.getProducts()).isNotEmpty();
	}

	@Test
	void unauthorizedAccess() throws Exception {
		mockMvc.perform(constructDefaultGetRequest(UUID.randomUUID()))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(constructDefaultPostRequest(UUID.randomUUID()))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void badPayload1() throws Exception {
		mockUserService.withDynamicMockUser((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId))
						.andExpect(status().isInternalServerError())
		);
	}

	@Test
	void badPayload2() throws Exception {
		mockUserService.withDynamicMockUser((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId)
								.content(""))
						.andExpect(status().isInternalServerError())
		);
	}

	@Test
	void badPayload3() throws Exception {
		mockUserService.withDynamicMockUser((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId)
								.content("{}"))
						.andExpect(status().isBadRequest())
		);
	}

	@Test
	void badPayload4() throws Exception {
		mockUserService.withDynamicMockUser((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId)
								.content("{\"nonexistentField\":  null}"))
						.andExpect(status().isBadRequest())
		);
	}

	@Test
	void badPayloadValidation1() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isBadRequest());
		});
	}

	@Test
	void badPayloadValidation2() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.items(List.of())
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items']").value("The list of items in an order cannot be null or empty"));
		});
	}

	@Test
	void badPayloadValidation3() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.items(List.of(
							PlacedOrderDto.Item.builder().productId(0).count(1).optionLists(List.of()).build()))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items[0].productId']").value("You cannot order a product with the ID less than or equal to 0"));
		});
	}

	@Test
	void badPayloadValidation4() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			var productId = productService.getProducts().stream().findFirst().orElseThrow().getId();

			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.items(List.of(
							PlacedOrderDto.Item.builder().productId(productId).count(0).optionLists(List.of()).build()))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items[0].count']").value("You cannot order an amount of items less than or equal to 0"));
		});
	}

	@Test
	void badPayloadValidation5() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			var productId = productService.getProducts().stream().findFirst().orElseThrow().getId();

			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.items(List.of(
							PlacedOrderDto.Item.builder().productId(productId).count(1).optionLists(null).build()
					))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items[0].optionLists']").value("The list of options for any item cannot be null, only empty if no options were selected"));
		});
	}

	@Test
	void badPayloadDBValues() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.items(List.of(
							PlacedOrderDto.Item.builder().productId(Integer.MAX_VALUE).count(1).optionLists(List.of()).build()
					))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isBadRequest());
		});
	}

	@Test
	void goodPayload1() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts().stream().limit(2).toList();

			assertThat(address).isNotNull();

			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map((p) -> PlacedOrderDto.Item.builder()
									.productId(p.getId())
									.count(2)
									.optionLists(List.of())
									.build()
							).toList()
					)
					.build();

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			BigDecimal expectedPrice = products.stream()
					.map(ProductDto::getPrice)
					.reduce(BigDecimal.ZERO, (acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(2))));

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}

	@Test
	void goodPayload2() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts();

			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> PlacedOrderDto.Item.builder()
									.productId(product.getId())
									.count(10)
									.optionLists(List.of())
									.build())
							.toList())
					.build();

			BigDecimal expectedPrice = products.stream()
					.map(ProductDto::getPrice)
					.reduce(BigDecimal.ZERO, (acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(10))));

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}

	@Test
	void goodPayload3() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts().stream()
					.map((product) -> productService.getProduct(product.getId()))
					.limit(5)
					.toList();

			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> {
								var orderItem = PlacedOrderDto.Item.builder()
										.productId(product.getId())
										.count(3)
										.optionLists(List.of())
										.build();

								if (product.getOptionLists().isEmpty()) {
									return orderItem;
								}

								OptionListDto optionList = product.getOptionLists().get(0);
								PlacedOrderDto.Item.OptionList optionListDTO = PlacedOrderDto.Item.OptionList.builder()
										.optionListId(optionList.getId())
										.options(List.of(
												PlacedOrderDto.Item.OptionList.Option.builder()
														.optionId(optionList.getOptions().get(0).getId())
														.count(1)
														.build()
										))
										.build();

								orderItem.setOptionLists(List.of(optionListDTO));
								return orderItem;
							})
							.toList())
					.build();

			BigDecimal expectedPrice = products.stream()
					.map((product) -> product.getPrice()
							.add(!product.getOptionLists().isEmpty()
									? product.getOptionLists().get(0).getOptions().get(0).getPrice()
									: BigDecimal.ZERO)
							.multiply(BigDecimal.valueOf(3)))
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}

	@Test
	void goodPayload4() throws Exception {
		mockUserService.withDynamicMockUser((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts().stream()
					.map((product) -> productService.getProduct(product.getId()))
					.limit(5)
					.toList();

			AtomicInteger optionCounter = new AtomicInteger(0);

			PlacedOrderDto placedOrderDTO = PlacedOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> {
								var orderItem = PlacedOrderDto.Item.builder()
										.productId(product.getId())
										.count(optionCounter.incrementAndGet())
										.optionLists(List.of())
										.build();

								if (product.getOptionLists().isEmpty()) {
									return orderItem;
								}

								OptionListDto optionList = product.getOptionLists().get(0);
								OptionListDto.Option option = optionList.getOptions().get(0);

								PlacedOrderDto.Item.OptionList optionListDTO = PlacedOrderDto.Item.OptionList.builder()
										.optionListId(optionList.getId())
										.options(List.of(
												PlacedOrderDto.Item.OptionList.Option.builder()
														.optionId(option.getId())
														.count(option.getMaxCount())
														.build()
										))
										.build();

								orderItem.setOptionLists(List.of(optionListDTO));
								return orderItem;
							})
							.toList())
					.build();

			optionCounter.set(0);

			BigDecimal expectedPrice = products.stream()
					.map((product) -> {
						OptionListDto.Option option = !product.getOptionLists().isEmpty()
								? product.getOptionLists().get(0).getOptions().get(0)
								: OptionListDto.Option.builder().price(BigDecimal.ZERO).maxCount(1).build();
						System.out.println("Product: " + product.getName() + " Option: " + option.getName());
						return product.getPrice()
								.add(option.getPrice().multiply(BigDecimal.valueOf(option.getMaxCount())))
								.multiply(BigDecimal.valueOf(optionCounter.incrementAndGet()));
					})
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}
}
