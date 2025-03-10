package ro.pizzeriaq.qservices.service;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Account;
import ro.pizzeriaq.qservices.data.repository.AccountRepository;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AccountService {

	private final static Logger logger = LoggerFactory.getLogger(AccountService.class);


	private final AccountRepository accountRepository;
	private final PasswordEncoder passwordEncoder;


	public Optional<Account> getAccount(String email, String password) {
		var account = accountRepository.findByEmail(email);

		if (account.isPresent() && !passwordEncoder.matches(password, account.get().getPassword())) {
			logger.warn("Invalid password ( {} ) for account with email: ( {} )", password, email);
			return Optional.empty();
		}

		return account;
	}
}
