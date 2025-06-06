package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.Address;

import java.util.List;
import java.util.UUID;


@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

	@Query("SELECT a FROM Address a WHERE a.account.id = :accountId AND a.isActive = true")
	List<Address> findAllActiveByAccountId(@Param("accountId") UUID accountId);

}