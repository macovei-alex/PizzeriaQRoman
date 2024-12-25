package ro.pizzeriaq.qservices;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ro.pizzeriaq.qservices.service.EntityInitializerService;


@SpringBootApplication
public class QservicesApplication {

	private static final Logger logger = LoggerFactory.getLogger(QservicesApplication.class);


	@Value("${application.environment}")
	private String environment;


	public static void main(String[] args) {
		SpringApplication.run(QservicesApplication.class, args);
	}


	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedHeaders("*")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
			}
		};
	}


	@Bean
	public CommandLineRunner logEnvironment() {
		return (_) -> logger.info("Environment: {}", environment);
	}


	@Bean
	@Profile("default")
	public CommandLineRunner initializeEntities(EntityInitializerService entityInitializerService) {
		return (_) -> {
			// reInitEntities(entityInitializerService);
		};
	}


	private void reInitEntities(EntityInitializerService entityInitializerService) {
		entityInitializerService.deleteAll();

		entityInitializerService.addProducts();
		entityInitializerService.addOptionLists();
		entityInitializerService.bindOptionsToProducts();
	}
}
