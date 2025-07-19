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
		var accountId = getDynamicAccountId(condition);
		var auth = new UsernamePasswordAuthenticationToken(accountId, "unchecked-password", List.of());
		SecurityContextHolder.getContext().setAuthentication(auth);
		try {
			runnable.consume(accountId);
		} finally {
			SecurityContextHolder.clearContext();
		}
	}


	public UUID getDynamicAccountId(Predicate<Account> condition) throws Exception {
		return accountRepository.findAllActiveSortByCreatedAt().stream()
				.filter(condition)
				.findFirst()
				.orElseThrow(() -> new Exception("No account found with the specified criteria"))
				.getId();
	}


	public UUID getDynamicAccountIdWithPhoneNumber() throws Exception {
		return getDynamicAccountId((a) -> StringUtils.hasText(a.getPhoneNumber()));
	}

}
