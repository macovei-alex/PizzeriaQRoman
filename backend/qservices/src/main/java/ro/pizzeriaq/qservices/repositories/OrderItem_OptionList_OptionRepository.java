package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.OrderItem_OptionList_Option;

@Repository
public interface OrderItem_OptionList_OptionRepository extends JpaRepository<OrderItem_OptionList_Option, Integer> {
}
