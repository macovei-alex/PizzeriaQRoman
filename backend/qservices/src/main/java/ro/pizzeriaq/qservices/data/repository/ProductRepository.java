package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pizzeriaq.qservices.data.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
