package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.Account;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

	@NonNull
	@Query("SELECT a FROM Account a ORDER BY a.createdAt ASC")
	List<Account> findAll();


	@Query("SELECT a.conversationId FROM Account a WHERE a.id = :accountId")
	Optional<UUID> findConversationIdByAccountId(@NonNull UUID accountId);


	@Modifying
	@Query("UPDATE Account a SET a.conversationId = :conversationId WHERE a.id = :accountId")
	void updateConversationIdByAccountId(@NonNull UUID accountId, @Nullable UUID conversationId);

}
