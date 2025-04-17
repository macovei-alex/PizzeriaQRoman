package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ro.pizzeriaq.qservices.data.entity.ProductCategory;

import java.util.List;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
	@Query("SELECT c FROM ProductCategory c ORDER BY c.sortId ASC")
	List<ProductCategory> findAllOrderBySortIdAsc();
}
