package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.Address;

import java.util.List;
import java.util.UUID;


@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

	@Query("SELECT a FROM Address a WHERE a.account.id = ?1 AND a.isPrimary = true")
	List<Address> findAllByAccountId(UUID accountId);
}