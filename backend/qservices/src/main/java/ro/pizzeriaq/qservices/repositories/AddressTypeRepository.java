package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.AddressType;

import java.util.Optional;

@Repository
public interface AddressTypeRepository extends JpaRepository<AddressType, Integer> {

	@Query("SELECT at FROM AddressType at WHERE at.name = :name")
	Optional<AddressType> findByName(String name);

}