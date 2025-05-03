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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.entity.OrderStatus;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;
import ro.pizzeriaq.qservices.data.repository.AddressRepository;
import ro.pizzeriaq.qservices.service.DTO.OptionListDTO;
import ro.pizzeriaq.qservices.service.DTO.PlacedOrderDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.EntityInitializerService;
import ro.pizzeriaq.qservices.service.OrderService;
import ro.pizzeriaq.qservices.service.ProductService;
import ro.pizzeriaq.qservices.utils.ThrowingRunnable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class OrderControllerTest {

	private static final Logger logger = LoggerFactory.getLogger(OrderControllerTest.class);


	@Value("${server.servlet.context-path}")
	private String contextPath;

	@Value("${app.environment}")
	private String environment;


	@Autowired private EntityInitializerService entityInitializerService;
	@Autowired private ProductService productService;
	@Autowired private MockMvc mockMvc;
	@Autowired private ObjectMapper objectMapper;
	@Autowired private OrderService orderService;
	@Autowired private AccountRepository accountRepository;
	@Autowired private AddressRepository addressRepository;


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


	private void withDynamicMockUser(ThrowingRunnable runnable) throws Exception {
		var account = accountRepository.findAll().get(0);
		var auth = new UsernamePasswordAuthenticationToken(account.getId(), "unchecked-password", List.of());
		SecurityContextHolder.getContext().setAuthentication(auth);
		runnable.run();
		SecurityContextHolder.clearContext();
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
	void entitiesInitialization() {
		assertThat(productService.getProducts()).isNotEmpty();
	}

	@Test
	void unauthorizedAccess() throws Exception {
		mockMvc.perform(constructDefaultGetRequest())
				.andExpect(status().isUnauthorized());

		mockMvc.perform(constructDefaultPostRequest())
				.andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockUser()
	void badPayload1() throws Exception {
		mockMvc.perform(constructDefaultPostRequest())
				.andExpect(status().isInternalServerError());
	}

	@Test
	@WithMockUser
	void badPayload2() throws Exception {
		mockMvc.perform(constructDefaultPostRequest()
						.content(""))
				.andExpect(status().isInternalServerError());
	}

	@Test
	@WithMockUser
	void badPayload3() throws Exception {
		mockMvc.perform(constructDefaultPostRequest()
						.content("{}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void badPayload4() throws Exception {
		mockMvc.perform(constructDefaultPostRequest()
						.content("{\"nonexistentField\":  null}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void badPayloadValidation1() throws Exception {
		PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
				.items(null)
				.build();

		mockMvc.perform(constructDefaultPostRequest()
						.content(objectMapper.writeValueAsString(placedOrderDTO)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
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
	@WithMockUser
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
	@WithMockUser
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
	@WithMockUser
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
	@WithMockUser
	void badPayloadDBValues() throws Exception {
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
	void goodPayload1() throws Exception {
		withDynamicMockUser(() -> {
			var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
			var address = addressRepository.findAllByAccountId(UUID.fromString(accountId)).get(0);
			var products = productService.getProducts().stream().limit(2).toList();

			assertThat(address).isNotNull();

			PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map((p) -> PlacedOrderDTO.Item.builder()
									.productId(p.getId())
									.count(2)
									.optionLists(List.of())
									.build()
							).toList()
					)
					.build();

			var historyOrders = orderService.getOrdersHistory();

			BigDecimal expectedPrice = products.stream()
					.map(ProductDTO::getPrice)
					.reduce(BigDecimal.ZERO, (acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(2))));

			mockMvc.perform(constructDefaultPostRequest()
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest())
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
		withDynamicMockUser(() -> {
			var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
			var address = addressRepository.findAllByAccountId(UUID.fromString(accountId)).get(0);
			var products = productService.getProducts();

			PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> PlacedOrderDTO.Item.builder()
									.productId(product.getId())
									.count(10)
									.optionLists(List.of())
									.build())
							.toList())
					.build();

			BigDecimal expectedPrice = products.stream()
					.map(ProductDTO::getPrice)
					.reduce(BigDecimal.ZERO, (acc, price) -> acc.add(price.multiply(BigDecimal.valueOf(10))));

			var historyOrders = orderService.getOrdersHistory();

			mockMvc.perform(constructDefaultPostRequest()
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest())
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
		withDynamicMockUser(() -> {
			var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
			var address = addressRepository.findAllByAccountId(UUID.fromString(accountId)).get(0);
			var products = productService.getProducts().stream()
					.map((product) -> productService.getProduct(product.getId()).orElseThrow())
					.limit(5)
					.toList();

			PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> {
								var orderItem = PlacedOrderDTO.Item.builder()
										.productId(product.getId())
										.count(3)
										.optionLists(List.of())
										.build();

								if (product.getOptionLists().isEmpty()) {
									return orderItem;
								}

								OptionListDTO optionList = product.getOptionLists().get(0);
								PlacedOrderDTO.Item.OptionList optionListDTO = PlacedOrderDTO.Item.OptionList.builder()
										.optionListId(optionList.getId())
										.options(List.of(
												PlacedOrderDTO.Item.OptionList.Option.builder()
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

			var historyOrders = orderService.getOrdersHistory();

			mockMvc.perform(constructDefaultPostRequest()
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest())
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
		withDynamicMockUser(() -> {
			var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
			var address = addressRepository.findAllByAccountId(UUID.fromString(accountId)).get(0);
			var products = productService.getProducts().stream()
					.map((product) -> productService.getProduct(product.getId()).orElseThrow())
					.limit(5)
					.toList();

			AtomicInteger optionCounter = new AtomicInteger(0);

			PlacedOrderDTO placedOrderDTO = PlacedOrderDTO.builder()
					.addressId(address.getId())
					.items(products.stream()
							.map(product -> {
								var orderItem = PlacedOrderDTO.Item.builder()
										.productId(product.getId())
										.count(optionCounter.incrementAndGet())
										.optionLists(List.of())
										.build();

								if (product.getOptionLists().isEmpty()) {
									return orderItem;
								}

								OptionListDTO optionList = product.getOptionLists().get(0);
								OptionListDTO.Option option = optionList.getOptions().get(0);

								PlacedOrderDTO.Item.OptionList optionListDTO = PlacedOrderDTO.Item.OptionList.builder()
										.optionListId(optionList.getId())
										.options(List.of(
												PlacedOrderDTO.Item.OptionList.Option.builder()
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
						OptionListDTO.Option option = !product.getOptionLists().isEmpty()
								? product.getOptionLists().get(0).getOptions().get(0)
								: OptionListDTO.Option.builder().price(BigDecimal.ZERO).maxCount(1).build();
						System.out.println("Product: " + product.getName() + " Option: " + option.getName());
						return product.getPrice()
								.add(option.getPrice().multiply(BigDecimal.valueOf(option.getMaxCount())))
								.multiply(BigDecimal.valueOf(optionCounter.incrementAndGet()));
					})
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			var historyOrders = orderService.getOrdersHistory();

			mockMvc.perform(constructDefaultPostRequest()
							.content(objectMapper.writeValueAsString(placedOrderDTO)))
					.andExpect(status().isOk());

			mockMvc.perform(constructDefaultGetRequest())
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray())
					.andExpect(jsonPath("$.length()").value(historyOrders.size() + 1))
					.andExpect(jsonPath("$[0].totalPrice").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].totalPriceWithDiscount").value(expectedPrice.floatValue()))
					.andExpect(jsonPath("$[0].orderStatus").value(OrderStatus.RECEIVED.name()));
		});
	}
}
