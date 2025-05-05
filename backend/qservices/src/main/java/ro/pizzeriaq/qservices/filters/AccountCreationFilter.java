package ro.pizzeriaq.qservices.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.io.IOException;

public class AccountCreationFilter extends OncePerRequestFilter {

	private final AccountService accountService;
	private final KeycloakService keycloakService;
	private final AuthenticationInsightsService authenticationInsightsService;
	private final Object lock = new Object();


	public AccountCreationFilter(
			AccountService accountService,
			KeycloakService keycloakService,
			AuthenticationInsightsService authenticationInsightsService
	) {
		this.accountService = accountService;
		this.keycloakService = keycloakService;
		this.authenticationInsightsService = authenticationInsightsService;
	}


	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {
		var id = authenticationInsightsService.getAuthenticationId();

		if (!accountService.exists(id)) {
			// synchronized to prevent multiple requests from creating the same account multiple times
			// possibly add a mutex per account instead of per method in the future for a performance increase
			synchronized (lock) {
				if (!accountService.exists(id)) {
					var keycloakUser = keycloakService.getUser(id);
					accountService.createAccount(keycloakUser);
					logger.info("Account created for user with id ( %s )".formatted(keycloakUser.id()));
				}
			}
		}

		filterChain.doFilter(request, response);
	}
}
