package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ro.pizzeriaq.qservices.data.model.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

	@Query("SELECT p, p.category FROM Product p JOIN ProductCategory pc ON p.category = pc")
	List<Product> findAllWithCategory();
}
