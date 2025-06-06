package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.pizzeriaq.qservices.data.entities.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

	@Query("""
		SELECT p FROM Product p
		JOIN FETCH p.category
	""")
	List<Product> findAllCategoryPreload();


	@Query("""
		SELECT DISTINCT p FROM Product p
		JOIN FETCH p.category
		LEFT JOIN FETCH p.optionLists
		WHERE p.id = :id
	""")
	Optional<Product> findByIdOptionListsPreload(@Param("id") Integer id);

	// Only works for relations mapped using Set, not List
//	@EntityGraph("Product.fullPreload")
//	@Query("""
//		SELECT p FROM Product p
//		WHERE p.id = :id
//	""")
//	Optional<Product> findByIdFullPreload(@Param("id") Integer id);
}
