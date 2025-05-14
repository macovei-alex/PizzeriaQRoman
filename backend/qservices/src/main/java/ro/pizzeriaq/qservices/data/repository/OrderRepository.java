package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.Order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

	@Query("""
		SELECT o FROM Order o
		WHERE o.account.id = :accountId
		ORDER BY o.orderTimestamp DESC, o.id DESC
	""")
	List<Order> findByAccountIdOrderByOrderTimestampDesc(@Param("accountId") UUID accountId, Pageable pageable);


	@EntityGraph(attributePaths = {"address", "coupon", "orderItems"})
	Optional<Order> findById(int orderId);
}
