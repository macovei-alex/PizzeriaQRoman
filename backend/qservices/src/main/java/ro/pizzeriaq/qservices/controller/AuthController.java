package ro.pizzeriaq.qservices.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.exceptions.JwtConvertAuthenticationException;
import ro.pizzeriaq.qservices.security.JwtAuthentication;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.DTO.LoginCredentialsDTO;
import ro.pizzeriaq.qservices.service.DTO.RefreshCredentialsDTO;
import ro.pizzeriaq.qservices.service.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);


	private final JwtService jwtService;
	private final AccountService accountService;


	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginCredentialsDTO credentials) {
		var account = accountService.getAccount(credentials.getEmail(), credentials.getPassword());
		if (account.isEmpty()) {
			return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
		}

		try {
			var tokenPair = jwtService.generateTokenPair(account.get().getId());
			accountService.updateTokens(account.get().getId(), tokenPair.getAccessToken(), tokenPair.getRefreshToken());
			return ResponseEntity.ok(tokenPair);
		} catch (JOSEException e) {
			return ResponseEntity.status(500).body(Map.of("error", "Token generation failed"));
		}
	}


	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@RequestBody @Valid RefreshCredentialsDTO credentials) {
		JwtAuthentication jwtAuthentication;
		try {
			jwtAuthentication = jwtService.convertToken(credentials.getRefreshToken());
		} catch (JwtConvertAuthenticationException e) {
			logger.error("Failed to convert refresh token", e);
			return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
		}

		var account = accountService.getAccountForRefresh(jwtAuthentication.getSubject(), credentials.getRefreshToken());
		if (account.isEmpty()) {
			return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
		}

		try {
			var tokenPair = jwtService.generateTokenPair(account.get().getId());
			accountService.updateTokens(account.get().getId(), tokenPair.getAccessToken(), tokenPair.getRefreshToken());
			return ResponseEntity.ok(tokenPair);
		} catch (JOSEException | EntityNotFoundException e) {
			return ResponseEntity.status(500).body(Map.of("error", "Token generation failed"));
		}
	}
}
