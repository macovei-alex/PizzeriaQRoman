package ro.pizzeriaq.qservices.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.util.Pair;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.pizzeriaq.qservices.service.JwtService;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


	private final JwtService jwtService;


	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain
	) throws ServletException, IOException {

		String token = extractToken(request);

		if (token == null || SecurityContextHolder.getContext().getAuthentication() != null) {
			filterChain.doFilter(request, response);
			return;
		}

		JWTClaimsSet claims;

		try {
			claims = jwtService.parseToken(token);
		} catch (ParseException | JOSEException e) {
			logger.error("Failed to parse JWT token. This error should never happen", e);
			response.sendError(
					HttpServletResponse.SC_BAD_REQUEST,
					"Something went wrong when parsing the JWT"
			);
			return;
		}

		var validationResult = validateToken(claims);

		if (validationResult.getLeft() != HttpServletResponse.SC_OK) {
			logger.error("JWT token validation failed: {}", validationResult.getRight());
			response.sendError(validationResult.getLeft(), validationResult.getRight());
			return;
		}

		List<? extends GrantedAuthority> roles;

		try {
			roles = claims.getListClaim("roles").stream()
					.map(Object::toString)
					.filter(authority -> authority.startsWith("ROLE_"))
					.map(SimpleGrantedAuthority::new)
					.toList();
		} catch (ParseException e) {
			logger.error("Failed to parse roles claim from JWT token even after the validation passed", e);
			response.sendError(
					HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Something went wrong when parsing the JWT"
			);
			return;
		}

		JwtAuthentication jwtAuthentication = JwtAuthentication.builder()
				.isAuthenticated(true)
				.issuer(claims.getIssuer())
				.subject(claims.getSubject())
				.expiresAt(claims.getExpirationTime())
				.authorities(roles)
				.build();

		SecurityContextHolder.getContext().setAuthentication(jwtAuthentication);

		filterChain.doFilter(request, response);
	}


	private String extractToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}

		return null;
	}


	private Pair<Integer, String> validateToken(JWTClaimsSet claims) {
		if (claims.getSubject() == null || claims.getSubject().isEmpty()) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no subject");
		}

		if (claims.getIssuer() == null || claims.getIssuer().isEmpty()) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no issuer");
		}

		if (claims.getExpirationTime() == null) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no expiration time");
		}

		if (claims.getExpirationTime().before(new Date())) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has expired");
		}

		try {
			if (claims.getListClaim("roles") == null) {
				return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has no roles");
			}
		} catch (ParseException e) {
			return Pair.of(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has invalid roles");
		}

		return Pair.of(HttpServletResponse.SC_OK, null);
	}
}
