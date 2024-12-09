package ro.pizzeriaq.qservices;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ro.pizzeriaq.qservices.service.EntityInitializerService;


@SpringBootApplication
public class QservicesApplication {

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
