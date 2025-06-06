package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ro.pizzeriaq.qservices.data.entities.ProductCategory;

import java.util.List;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
	@Query("SELECT c FROM ProductCategory c ORDER BY c.sortId ASC")
	List<ProductCategory> findAllOrderBySortIdAsc();
}
