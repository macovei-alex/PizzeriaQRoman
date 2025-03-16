package ro.pizzeriaq.qservices.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.Account;
import ro.pizzeriaq.qservices.data.model.Token;
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


	@Transactional
	public Optional<Account> getAccountForRefresh(String accountId, String refreshToken) {
		var account = accountRepository.findById(accountId);
		if (account.isEmpty()) {
			logger.warn("Account with id: ( {} ) not found", accountId);
			return Optional.empty();
		}

		var token = account.get().getToken();
		if (token == null) {
			logger.warn("Account with id: ( {} ) has no associated token entity", accountId);
			return Optional.empty();
		}

		if (!token.getRefreshToken().equals(refreshToken)) {
			logger.warn("Invalid refresh token ( {} ) for account with id: ( {} )", refreshToken, accountId);
			return Optional.empty();
		}

		return account;
	}


	@Transactional
	public void updateTokens(String accountId, String accessToken, String refreshToken) throws EntityNotFoundException {
		var account = accountRepository.findById(accountId);
		if (account.isEmpty()) {
			logger.error("Account with id ( {} ) not found", accountId);
			throw new EntityNotFoundException("Account not found");
		}

		var token = account.get().getToken();
		if (token == null) {
			token = Token.builder()
					.accessToken(accessToken)
					.refreshToken(refreshToken)
					.build();

			account.get().setToken(token);
		} else {
			token.setAccessToken(accessToken);
			token.setRefreshToken(refreshToken);
		}
	}
}
