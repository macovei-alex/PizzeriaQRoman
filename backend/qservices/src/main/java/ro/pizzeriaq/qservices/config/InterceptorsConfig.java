package ro.pizzeriaq.qservices.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ro.pizzeriaq.qservices.config.interceptors.AccountIdCheckingInterceptor;

@Configuration
@AllArgsConstructor
public class InterceptorsConfig implements WebMvcConfigurer {

	private final AccountIdCheckingInterceptor accountIdCheckingInterceptor;


	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(accountIdCheckingInterceptor).addPathPatterns("/accounts/**");
	}

}
