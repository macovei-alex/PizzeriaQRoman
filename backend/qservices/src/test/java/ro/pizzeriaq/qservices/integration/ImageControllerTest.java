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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import ro.pizzeriaq.qservices.config.Container;
import ro.pizzeriaq.qservices.config.IntegrationTestConfig;
import ro.pizzeriaq.qservices.config.TestcontainersRegistry;
import ro.pizzeriaq.qservices.data.dtos.ProductDto;
import ro.pizzeriaq.qservices.services.EntityInitializerService;
import ro.pizzeriaq.qservices.services.ImageService;
import ro.pizzeriaq.qservices.services.ProductService;
import ro.pizzeriaq.qservices.utils.MockUserService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@IntegrationTestConfig
public class ImageControllerTest {

	@Value("${server.servlet.context-path}")
	String contextPath;

	@Autowired
	EntityInitializerService entityInitializerService;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	ImageService imageService;
	@Autowired
	ProductService productService;
	@Autowired
	MockUserService mockUserService;


	@DynamicPropertySource
	static void registerContainers(DynamicPropertyRegistry registry) {
		TestcontainersRegistry.start(registry, Container.MySQL, Container.Keycloak);
	}


	MockHttpServletRequestBuilder createDefaultImageRequest(String imageName) {
		return get(contextPath + "/images/" + imageName + "?v=0")
				.contextPath(contextPath)
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
		assertThat(productService.getActiveProducts()).isNotEmpty();
	}

	@Test
	void allExistingImages() {
		productService.getActiveProducts().stream()
				.map(ProductDto::imageName)
				.forEach((imageName) -> {
					var expectedImage = imageService.loadImage(imageName);
					try {
						mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
							mockMvc.perform(createDefaultImageRequest(imageName))
									.andExpect(status().isOk())
									.andExpect(content().contentTypeCompatibleWith(expectedImage.type()))
									.andExpect(content().bytes(expectedImage.data()));
						});
					} catch (Exception e) {
						throw new RuntimeException(e);
					}
				});
	}

	@Test
	void badImageFormat() throws Exception {
		var someInexistentImage = "some-image-name.inexistent-format";
		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(createDefaultImageRequest(someInexistentImage))
					.andExpect(status().isUnprocessableEntity());
		});
	}

	@Test
	void inexistentImage() throws Exception {
		var someInexistentImage = "some-image-name.jpeg";
		mockUserService.withDynamicMockUserWithPhoneNumber((_) -> {
			mockMvc.perform(createDefaultImageRequest(someInexistentImage))
					.andExpect(status().isNotFound());
		});
	}

}
