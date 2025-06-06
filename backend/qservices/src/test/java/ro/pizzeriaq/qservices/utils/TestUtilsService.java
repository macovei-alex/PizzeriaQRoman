package ro.pizzeriaq.qservices.utils;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.repositories.AccountRepository;

import java.util.List;
import java.util.UUID;

@Service
@Profile("test")
@AllArgsConstructor
public class TestUtilsService {

	private AccountRepository accountRepository;


	public void withDynamicMockUser(ThrowingConsumer<UUID> runnable) throws Exception {
		withDynamicMockUser(true, runnable);
	}


	public void withDynamicMockUser(boolean hasPhoneNumber, ThrowingConsumer<UUID> runnable) throws Exception {
		var account = accountRepository.findAll().stream()
				.filter(a -> hasPhoneNumber || (a.getPhoneNumber() != null && !a.getPhoneNumber().isEmpty()))
				.findFirst()
				.orElseThrow(() -> new Exception("No account found with the specified criteria"));
		var auth = new UsernamePasswordAuthenticationToken(account.getId(), "unchecked-password", List.of());
		SecurityContextHolder.getContext().setAuthentication(auth);
		try {
			runnable.consume(account.getId());
		} finally {
			SecurityContextHolder.clearContext();
		}
	}

}
