package ro.pizzeriaq.qservices.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.service.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

	private final JwtService jwtService;

	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestParam String username) {
		try {
			String accessToken = jwtService.generateToken(username, 15 * 60 * 1000);
			String refreshToken = jwtService.generateToken(username, 7 * 24 * 60 * 60 * 1000);

			return ResponseEntity.ok(Map.of(
					"access_token", accessToken,
					"refresh_token", refreshToken
			));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Token generation failed"));
		}
	}
}
