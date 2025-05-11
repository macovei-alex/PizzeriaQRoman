package ro.pizzeriaq.qservices.config;

import jakarta.servlet.Filter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ro.pizzeriaq.qservices.config.filters.AccountCreationFilter;
import ro.pizzeriaq.qservices.config.filters.CustomRequestLoggingFilter;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.KeycloakService;

@Configuration
public class FiltersConfig {

	@Bean
	public FilterRegistrationBean<Filter> customRequestLoggingFilter() {
		FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new CustomRequestLoggingFilter());
		registrationBean.addUrlPatterns("/*");
		registrationBean.setOrder(1);
		return registrationBean;
	}


	@Bean
	public FilterRegistrationBean<Filter> accountCreationFilter(
			AccountService accountService,
			KeycloakService keycloakService,
			AuthenticationInsightsService authenticationInsightsService
	) {
		FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new AccountCreationFilter(accountService, keycloakService, authenticationInsightsService));
		registrationBean.addUrlPatterns("/*");
		registrationBean.setOrder(2);
		return registrationBean;
	}

}
