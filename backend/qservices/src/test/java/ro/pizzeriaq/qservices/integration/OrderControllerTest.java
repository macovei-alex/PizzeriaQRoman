package ro.pizzeriaq.qservices.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.IntegrationTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.dtos.OptionListDto;
import ro.pizzeriaq.qservices.data.dtos.PlaceOrderDto;
import ro.pizzeriaq.qservices.data.dtos.ProductDto;
import ro.pizzeriaq.qservices.data.entities.OrderStatus;
import ro.pizzeriaq.qservices.exceptions.response.LogicalErrorCode;
import ro.pizzeriaq.qservices.repositories.AddressRepository;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.OrderService;
import ro.pizzeriaq.qservices.services.ProductService;
import ro.pizzeriaq.qservices.utils.MockUserService;

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

@IntegrationTestConfig
public class OrderControllerTest {

	@Value("${server.servlet.context-path}")
	String contextPath;

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
		TestcontainersRegistry.start(registry, Container.MySQL, Container.Keycloak);
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
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId))
						.andExpect(status().isBadRequest())
		);
	}

	@Test
	void badPayload2() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId)
								.content(""))
						.andExpect(status().isBadRequest())
		);
	}

	@Test
	void badPayload3() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId)
								.content("{}"))
						.andExpect(status().isBadRequest())
		);
	}

	@Test
	void badPayload4() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) ->
				mockMvc.perform(constructDefaultPostRequest(accountId)
								.content("{\"nonexistentField\":  null}"))
						.andExpect(status().isBadRequest())
		);
	}

	@Test
	void badPayloadValidation1() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isBadRequest());
		});
	}

	@Test
	void badPayloadValidation2() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.items(List.of())
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items']").value("The list of items in an order cannot be null or empty"));
		});
	}

	@Test
	void badPayloadValidation3() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.items(List.of(
							PlaceOrderDto.Item.builder().productId(0).count(1).optionLists(List.of()).build()))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items[0].productId']").value("You cannot order a product with the ID less than or equal to 0"));
		});
	}

	@Test
	void badPayloadValidation4() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var productId = productService.getProducts().stream().findFirst().orElseThrow().id();

			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.items(List.of(
							PlaceOrderDto.Item.builder().productId(productId).count(0).optionLists(List.of()).build()))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items[0].count']").value("You cannot order an amount of items less than or equal to 0"));
		});
	}

	@Test
	void badPayloadValidation5() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var productId = productService.getProducts().stream().findFirst().orElseThrow().id();

			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.items(List.of(
							PlaceOrderDto.Item.builder().productId(productId).count(1).optionLists(null).build()
					))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.['items[0].optionLists']")
							.value("The list of options for any item cannot be null, only empty if no options were selected"));
		});
	}

	@Test
	void userWithNoPhoneNumber() throws Exception {
		mockUserService.withDynamicMockUser(
				(a) -> !StringUtils.hasText(a.getPhoneNumber()),
				(accountId) -> {
					var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
					var products = productService.getProducts().stream().limit(2).toList();

					PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
							.addressId(address.getId())
							.items(products.stream()
									.map((p) -> PlaceOrderDto.Item.builder()
											.productId(p.id())
											.count(2)
											.optionLists(List.of())
											.build()
									)
									.toList()
							)
							.clientExpectedPrice(products.stream()
									.map(ProductDto::price)
									.reduce(BigDecimal.ZERO,
											(acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(2)))
									)
							)
							.build();

					mockMvc.perform(constructDefaultPostRequest(accountId)
									.content(objectMapper.writeValueAsString(placeOrderDTO)))
							.andExpect(status().isExpectationFailed())
							.andExpect(jsonPath("$.code").value(LogicalErrorCode.PHONE_NUMBER_MISSING.name()))
							.andExpect(jsonPath("$.message")
									.value("Phone number is missing for account with id: %s".formatted(accountId))
							);
				}
		);
	}

	@Test
	void badPayloadDBValues() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.items(List.of(
							PlaceOrderDto.Item.builder().productId(Integer.MAX_VALUE).count(1).optionLists(List.of()).build()
					))
					.build();

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isBadRequest());
		});
	}

	@Test
	void goodPayload1() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts().stream().limit(2).toList();

			assertThat(address).isNotNull();

			PlaceOrderDto placeOrderDTO = PlaceOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map((p) -> PlaceOrderDto.Item.builder()
									.productId(p.id())
									.count(2)
									.optionLists(List.of())
									.build()
							)
							.toList()
					)
					.clientExpectedPrice(products.stream()
							.map(ProductDto::price)
							.reduce(BigDecimal.ZERO,
									(acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(2)))
							)
					)
					.build();

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount")
							.value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}

	@Test
	void goodPayload2() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts();

			var placeOrderDTO = PlaceOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> PlaceOrderDto.Item.builder()
									.productId(product.id())
									.count(10)
									.optionLists(List.of())
									.build()
							)
							.toList()
					)
					.clientExpectedPrice(products.stream()
							.map(ProductDto::price)
							.reduce(BigDecimal.ZERO,
									(acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(10)))
							)
					)
					.build();

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount")
							.value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}

	@Test
	void goodPayload3() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts().stream()
					.map((product) -> productService.getProduct(product.id()))
					.limit(5)
					.toList();

			var placeOrderDTO = PlaceOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> {
								var orderItemBuilder = PlaceOrderDto.Item.builder()
										.productId(product.id())
										.count(3)
										.optionLists(List.of());

								if (product.optionLists().isEmpty()) {
									return orderItemBuilder.build();
								}

								OptionListDto optionList = product.optionLists().get(0);
								var optionListDTO = PlaceOrderDto.Item.OptionList.builder()
										.optionListId(optionList.getId())
										.options(List.of(
												PlaceOrderDto.Item.OptionList.Option.builder()
														.optionId(optionList.getOptions().get(0).getId())
														.count(1)
														.build()
										))
										.build();

								return orderItemBuilder
										.optionLists(List.of(optionListDTO))
										.build();
							})
							.toList()
					)
					.clientExpectedPrice(products.stream()
							.map((product) -> product.price()
									.add(!product.optionLists().isEmpty()
											? product.optionLists().get(0).getOptions().get(0).getPrice()
											: BigDecimal.ZERO)
									.multiply(BigDecimal.valueOf(3))
							)
							.reduce(BigDecimal.ZERO, BigDecimal::add)
					)
					.build();

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount")
							.value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}

	@Test
	void goodPayload4() throws Exception {
		mockUserService.withDynamicMockUserWithPhoneNumber((accountId) -> {
			var address = addressRepository.findAllActiveByAccountId(accountId).get(0);
			var products = productService.getProducts().stream()
					.map((product) -> productService.getProduct(product.id()))
					.limit(5)
					.toList();

			AtomicInteger optionCounter = new AtomicInteger(0);
			AtomicInteger expectedPriceOptionCounter = new AtomicInteger(0);

			var placeOrderDTO = PlaceOrderDto.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> {
								var orderItemBuilder = PlaceOrderDto.Item.builder()
										.productId(product.id())
										.count(optionCounter.incrementAndGet())
										.optionLists(List.of());

								if (product.optionLists().isEmpty()) {
									return orderItemBuilder.build();
								}

								OptionListDto optionList = product.optionLists().get(0);
								OptionListDto.Option option = optionList.getOptions().get(0);

								PlaceOrderDto.Item.OptionList optionListDTO = PlaceOrderDto.Item.OptionList.builder()
										.optionListId(optionList.getId())
										.options(List.of(
												PlaceOrderDto.Item.OptionList.Option.builder()
														.optionId(option.getId())
														.count(option.getMaxCount())
														.build()
										))
										.build();

								return orderItemBuilder
										.optionLists(List.of(optionListDTO))
										.build();
							})
							.toList()
					)
					.clientExpectedPrice(products.stream()
							.map((product) -> {
								OptionListDto.Option option = !product.optionLists().isEmpty()
										? product.optionLists().get(0).getOptions().get(0)
										: OptionListDto.Option.builder().price(BigDecimal.ZERO).maxCount(1).build();
								return product.price()
										.add(option.getPrice().multiply(BigDecimal.valueOf(option.getMaxCount())))
										.multiply(BigDecimal.valueOf(expectedPriceOptionCounter.incrementAndGet()));
							})
							.reduce(BigDecimal.ZERO, BigDecimal::add)
					)
					.build();

			var historyOrders = orderService.getOrdersHistory(accountId, 0, 100);

			mockMvc.perform(constructDefaultPostRequest(accountId)
							.content(objectMapper.writeValueAsString(placeOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest(accountId))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount")
							.value(placeOrderDTO.clientExpectedPrice().doubleValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}
}
