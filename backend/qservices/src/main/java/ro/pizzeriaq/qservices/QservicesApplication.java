package ro.pizzeriaq.qservices;

import com.fasterxml.jackson.databind.DeserializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import ro.pizzeriaq.qservices.services.EntityInitializerService;

@Slf4j
@SpringBootApplication
public class QservicesApplication {

	@Value("${app.environment}")
	private String environment;
	@Value("${dev.repopulate.database:false}")
	private String repopulateDatabase;


	public static void main(String[] args) {
		SpringApplication.run(QservicesApplication.class, args);
	}

	@Bean
	public CommandLineRunner logEnvironment() {
		return (_) -> log.info("Environment: {}", environment);
	}


	@Bean
	@Profile("default")
	public CommandLineRunner initializeEntities(EntityInitializerService entityInitializerService) {
		return (_) -> {
			if (repopulateDatabase.equals("true")) {
				EntityInitializerService.reInitializeEntities(entityInitializerService);
			}
		};
	}


	@Bean
	Jackson2ObjectMapperBuilderCustomizer objectMapperCustomizer() {
		return builder ->
				builder.featuresToEnable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES);
	}

}
