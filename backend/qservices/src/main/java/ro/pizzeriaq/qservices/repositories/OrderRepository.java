package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.Order;

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
	List<Order> findByAccountIdSortByOrderTimestampDesc(UUID accountId, Pageable pageable);


	@Query("""
		SELECT o FROM Order o
		JOIN Account a ON o.account.id = a.id
		WHERE o.id = :orderId
			AND o.account.id = :accountId
			AND a.isActive = true
	""")
	@EntityGraph(attributePaths = {"account", "address", "coupon", "orderItems"})
	Optional<Order> findByIdPreload(int orderId, UUID accountId);
}
