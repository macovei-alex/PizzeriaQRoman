package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

	@Query("""
		SELECT p FROM Product p
		WHERE p.isActive = true
	""")
	List<Product> findAllActive();


	@Query("""
		SELECT p FROM Product p
		JOIN FETCH p.category
		WHERE p.isActive = true
	""")
	List<Product> findAllActiveCategoryPreload();


	@Query("""
		SELECT p FROM Product p
		WHERE p.id = :id
	""")
	@EntityGraph(attributePaths = {"category", "optionLists"})
	Optional<Product> findByIdOptionListsPreload(Integer id);
}
