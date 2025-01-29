package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.pizzeriaq.qservices.data.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

	@Query("SELECT p FROM Product p JOIN FETCH p.category")
	List<Product> findAllCategoryPreload();


	@Query("""
		SELECT p FROM Product p
		JOIN FETCH p.category
		JOIN FETCH p.optionLists
		WHERE p.id = :id
	""")
	Optional<Product> findByIdFullPreload(@Param("id") Integer id);
}
