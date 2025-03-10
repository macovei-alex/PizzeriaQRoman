package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.AccountService;
import ro.pizzeriaq.qservices.service.DTO.LoginCredentialsDTO;
import ro.pizzeriaq.qservices.service.JwtService;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

	private final JwtService jwtService;
	private final AccountService accountService;


	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody LoginCredentialsDTO credentials) {
		var account = accountService.getAccount(credentials.getEmail(), credentials.getPassword());
		if (account.isEmpty()) {
			return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
		}

		try {
			String accessToken = jwtService.generateToken(account.get().getId(), Duration.ofMinutes(15));
			String refreshToken = jwtService.generateToken(account.get().getId(), Duration.ofDays(30));

			return ResponseEntity.ok(Map.of(
					"access_token", accessToken,
					"refresh_token", refreshToken
			));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Token generation failed"));
		}
	}

}
