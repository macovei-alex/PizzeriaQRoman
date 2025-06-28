package ro.pizzeriaq.qservices.config.interceptors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import ro.pizzeriaq.qservices.config.annotations.AccountIdChecked;
import ro.pizzeriaq.qservices.exceptions.AccessDeniedException;
import ro.pizzeriaq.qservices.services.AuthenticationInsightsService;

import java.util.Arrays;
import java.util.UUID;

@Slf4j
@AllArgsConstructor
@Component
public class AccountIdCheckingInterceptor implements HandlerInterceptor {


	private final AuthenticationInsightsService authenticationInsightsService;


	@Override
	public boolean preHandle(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull Object handler
	) {

		if (!(handler instanceof HandlerMethod method)) {
			// Not a controller method
			return true;
		}

		var annotation = method.getMethodAnnotation(AccountIdChecked.class);
		if (annotation == null) {
			// No corresponding annotation present
			return true;
		}

		if (annotation.allowAdmin() && authenticationInsightsService.isAdmin()) {
			// Admin can query any user's data
			return true;
		}

		var routeSegments = request.getRequestURI().split("/");
		var accountsRouteName = "accounts";
		var accountsSegmentIndex = Arrays.asList(routeSegments).indexOf(accountsRouteName);

		if (accountsSegmentIndex == -1) {
			// No accounts segment in the route
			log.warn("Route ( {} ) does not contain accounts segment. This should never happen. Check for possible interceptors configuration mistakes",
					request.getRequestURI()
			);
			return true;
		}

		if (accountsSegmentIndex + 1 >= routeSegments.length) {
			// No accountId path variable after accounts segment
			return true;
		}

		try {
			var accountId = UUID.fromString(routeSegments[accountsSegmentIndex + 1]);
			if (!authenticationInsightsService.isIdSameAs(accountId)) {
				// Different accountId
				var userId = authenticationInsightsService.getAuthenticationId();
				throw new AccessDeniedException("Account ( %s ) not authorized to access user ( %s ) for request ( %s )"
						.formatted(userId, accountId, request.getRequestURI())
				);
			}
			return true;

		} catch (IllegalArgumentException ex) {
			// Invalid UUID
			log.warn("Invalid accountId format ( {} ) in route ( {} ). This should never happen. Please check @AccountIdChecked annotation locations and remove those where the accountId path variable doesn't exist.",
					routeSegments[accountsSegmentIndex + 1],
					request.getRequestURI()
			);
			return true;
		}
	}

}
