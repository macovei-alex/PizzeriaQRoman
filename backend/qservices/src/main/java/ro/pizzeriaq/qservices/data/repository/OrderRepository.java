package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.model.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

	@Query("""
		SELECT order FROM Order order
		ORDER BY order.orderTimestamp DESC, order.id DESC
	""")
	List<Order> findAllOrderByOrderTimestampDesc();

}
