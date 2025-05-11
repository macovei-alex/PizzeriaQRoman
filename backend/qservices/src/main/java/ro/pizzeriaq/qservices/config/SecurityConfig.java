package ro.pizzeriaq.qservices.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import ro.pizzeriaq.qservices.data.model.Authorities;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Configuration
public class SecurityConfig {


	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
				.oauth2Client(Customizer.withDefaults())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/accounts").hasAuthority(Authorities.ADMIN.getName())
						.anyRequest().authenticated()
				)
				.anonymous(AbstractHttpConfigurer::disable)
				.cors(AbstractHttpConfigurer::disable)
				.csrf(AbstractHttpConfigurer::disable);

		return http.build();
	}


	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}


	@Bean
	public JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		converter.setJwtGrantedAuthoritiesConverter(jwt -> {
			Collection<GrantedAuthority> authorities = new ArrayList<>();

			Map<String, Object> realmAccess = jwt.getClaim("realm_access");
			if (realmAccess != null && realmAccess.get("roles") instanceof Collection<?> rolesCollection) {
				rolesCollection.forEach(role ->
						authorities.add(new SimpleGrantedAuthority(role.toString()))
				);
			}

			return authorities;
		});

		return converter;
	}


	// Optional config so that the client can be used to call other services without a ServletRequest
	@Bean
	public OAuth2AuthorizedClientManager authorizedClientManager(
			ClientRegistrationRepository clients,
			OAuth2AuthorizedClientService clientService
	) {
		var manager = new AuthorizedClientServiceOAuth2AuthorizedClientManager(clients, clientService);

		manager.setAuthorizedClientProvider(OAuth2AuthorizedClientProviderBuilder.builder()
				.clientCredentials()
				.build()
		);

		return manager;
	}

}

