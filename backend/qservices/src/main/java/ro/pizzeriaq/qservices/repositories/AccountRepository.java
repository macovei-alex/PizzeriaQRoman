package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.Account;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

	@NonNull
	@Query("""
		SELECT a FROM Account a
		WHERE a.isActive = true
		ORDER BY a.createdAt ASC
	""")
	List<Account> findAllActiveSortByCreatedAt();


	@Query("""
			SELECT a FROM Account a
			WHERE a.isActive = true AND a.id = :id
	""")
	Optional<Account> findActiveById(UUID id);


	@Query("SELECT COUNT(a) > 0 FROM Account a WHERE a.id = :id")
	boolean existsActiveById(UUID id);

}
