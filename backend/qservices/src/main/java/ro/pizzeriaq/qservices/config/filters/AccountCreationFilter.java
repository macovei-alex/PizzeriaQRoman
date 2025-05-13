package ro.pizzeriaq.qservices.config.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.pizzeriaq.qservices.data.cache.LRUCache;
import ro.pizzeriaq.qservices.data.cache.ThreadSafeLRUCache;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.AuthenticationInsightsService;
import ro.pizzeriaq.qservices.service.KeycloakService;

import java.io.IOException;
import java.util.UUID;

public class AccountCreationFilter extends OncePerRequestFilter {

	private final AccountService accountService;
	private final KeycloakService keycloakService;
	private final AuthenticationInsightsService authenticationInsightsService;

	private final LRUCache<UUID, Void> accountIdCache = new ThreadSafeLRUCache<>(1000);
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
		if (authenticationInsightsService.isAuthenticated()) {
			var id = authenticationInsightsService.getAuthenticationId();

			if (!accountIdCache.containsKey(id)) {
				// synchronized to prevent multiple requests from creating the same account multiple times
				// possibly add a mutex per account instead of per method in the future for a performance increase
				synchronized (lock) {
					if (!accountIdCache.containsKey(id) && !accountService.exists(id)) {
						var keycloakUser = keycloakService.getUser(id);
						accountService.createAccount(keycloakUser);
						logger.info("Account created for user with id ( %s )".formatted(keycloakUser.id()));
					}
					accountIdCache.put(id, null);
				}
			}
		}

		filterChain.doFilter(request, response);
	}
}
