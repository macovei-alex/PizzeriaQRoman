package ro.pizzeriaq.qservices.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Authorities;

import java.util.UUID;

@Service
public class AuthenticationInsightsService {

	public boolean isAdmin() {
		return SecurityContextHolder.getContext()
				.getAuthentication()
				.getAuthorities()
				.stream()
				.anyMatch(a -> a.getAuthority().equals(Authorities.ADMIN.getName()));
	}


	public boolean isIdSameAs(UUID userId) {
			return userId.equals(getAuthenticationId());
	}


	public UUID getAuthenticationId() {
		var jwtId = SecurityContextHolder.getContext().getAuthentication().getName();
		return UUID.fromString(jwtId);
	}


	public boolean isAuthenticated() {
		return SecurityContextHolder.getContext().getAuthentication() != null
				&& SecurityContextHolder.getContext().getAuthentication().isAuthenticated();
	}

}
