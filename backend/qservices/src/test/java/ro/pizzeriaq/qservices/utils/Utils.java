package ro.pizzeriaq.qservices.utils;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;

import java.util.List;

public interface Utils {

	static void withDynamicMockUser(AccountRepository accountRepository, ThrowingRunnable runnable)
			throws Exception {
		var account = accountRepository.findAll().get(0);
		var auth = new UsernamePasswordAuthenticationToken(account.getId(), "unchecked-password", List.of());
		SecurityContextHolder.getContext().setAuthentication(auth);
		try {
			runnable.run();
		} finally {
			SecurityContextHolder.clearContext();
		}
	}

}
