package ro.pizzeriaq.qservices.config.filters;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.AbstractRequestLoggingFilter;

public class CustomRequestLoggingFilter extends AbstractRequestLoggingFilter {

	@Override
	protected boolean shouldLog(@NonNull HttpServletRequest request) {
		return logger.isDebugEnabled();
	}


	@Override
	protected void beforeRequest(@NonNull HttpServletRequest request, @NonNull String message) {
		logger.debug(message);
	}


	@Override
	protected void afterRequest(@NonNull HttpServletRequest request, @NonNull String message) {
		// no logging after
	}
}
