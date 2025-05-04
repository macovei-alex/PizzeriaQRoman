package ro.pizzeriaq.qservices.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.io.IOException;

@AllArgsConstructor
public class AccountCreationFilter extends OncePerRequestFilter {

	private final AccountService accountService;
	private final KeycloakService keycloakService;
	private final AuthenticationInsightsService authenticationInsightsService;


	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {
		var id = authenticationInsightsService.getAuthenticationId();

		if (!accountService.existsById(id)) {
			var keycloakUser = keycloakService.getUser(id);
			accountService.createAccount(keycloakUser);
			logger.info("Account created for user with id ( %s )".formatted(keycloakUser.id()));
		}

		filterChain.doFilter(request, response);
	}
}
