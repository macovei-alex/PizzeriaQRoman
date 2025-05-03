package ro.pizzeriaq.qservices.data.repository;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.Account;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

	@Query("""
		SELECT a FROM Account a
		WHERE a.email = :email
	""")
	Optional<Account> findByEmail(@Param("email") String email);


	@NonNull
	@Query("""
		SELECT a FROM Account a
		ORDER BY a.createdAt ASC
	""")
	List<Account> findAll();

}
