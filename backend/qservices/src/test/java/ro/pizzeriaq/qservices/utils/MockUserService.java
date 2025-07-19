package ro.pizzeriaq.qservices.utils;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ro.pizzeriaq.qservices.data.entities.Account;
import ro.pizzeriaq.qservices.repositories.AccountRepository;

import java.util.List;
import java.util.UUID;
import java.util.function.Predicate;

@Service
@Profile("test")
@AllArgsConstructor
public class MockUserService {

	private AccountRepository accountRepository;


	public void withDynamicMockUserWithPhoneNumber(ThrowingConsumer<UUID> runnable) throws Exception {
		withDynamicMockUser((a) -> StringUtils.hasText(a.getPhoneNumber()), runnable);
	}


	public void withDynamicMockUser(Predicate<Account> condition, ThrowingConsumer<UUID> runnable) throws Exception {
		var account = accountRepository.findAllActiveSortByCreatedAt().stream()
				.filter(condition)
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
