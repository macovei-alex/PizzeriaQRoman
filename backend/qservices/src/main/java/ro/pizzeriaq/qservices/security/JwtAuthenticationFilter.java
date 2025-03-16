package ro.pizzeriaq.qservices.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.pizzeriaq.qservices.exceptions.JwtConvertAuthenticationException;
import ro.pizzeriaq.qservices.service.JwtService;

import java.io.IOException;

@Service
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


	private final JwtService jwtService;


	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {

		String token = extractToken(request);

		if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			try {
				JwtAuthentication jwtAuthentication = jwtService.convertToken(token);
				SecurityContextHolder.getContext().setAuthentication(jwtAuthentication);
			} catch (JwtConvertAuthenticationException e) {
				logger.warn("Failed to convert JWT token to authentication", e);
				response.setStatus(e.getStatus());
				return;
			}
		}

		filterChain.doFilter(request, response);
	}


	private String extractToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}

		return null;
	}

}
