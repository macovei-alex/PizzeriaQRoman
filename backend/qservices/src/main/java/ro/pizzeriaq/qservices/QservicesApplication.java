package ro.pizzeriaq.qservices;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.web.filter.AbstractRequestLoggingFilter;
import ro.pizzeriaq.qservices.service.EntityInitializerService;


@SpringBootApplication
public class QservicesApplication {

	private static final Logger logger = LoggerFactory.getLogger(QservicesApplication.class);


	@Value("${app.environment}")
	private String environment;


	public static void main(String[] args) {
		SpringApplication.run(QservicesApplication.class, args);
	}


	@Bean
	public CommandLineRunner logEnvironment() {
		return (_) -> logger.info("Environment: {}", environment);
	}


	@Bean
	@Profile("default")
	public CommandLineRunner initializeEntities(EntityInitializerService entityInitializerService) {
		return (_) -> {
			// EntityInitializerService.reInitializeEntities(entityInitializerService);
		};
	}


	@Bean
	public AbstractRequestLoggingFilter requestLoggingFilter() {
		var loggingFilter = new CustomRequestLoggingFilter();
		loggingFilter.setBeforeMessagePrefix("");
		loggingFilter.setIncludeQueryString(true);
		loggingFilter.setIncludeHeaders(true);
		loggingFilter.setIncludePayload(true);
		loggingFilter.setIncludeClientInfo(true);
		loggingFilter.setMaxPayloadLength(10000);
		return loggingFilter;
	}
}
