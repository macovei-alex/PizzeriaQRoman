package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.Account;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

	@NonNull
	@Query("SELECT a FROM Account a ORDER BY a.createdAt ASC")
	List<Account> findAll();

}
