package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.Order;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

	@Query("""
		SELECT order FROM Order order
		WHERE order.account.id = :accountId
		ORDER BY order.orderTimestamp DESC, order.id DESC
	""")
	List<Order> findByAccountIdOrderByOrderTimestampDesc(@Param("accountId") UUID accountId);

}
