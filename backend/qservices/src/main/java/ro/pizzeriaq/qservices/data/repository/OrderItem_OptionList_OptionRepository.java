package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.OrderItem_OptionList_Option;

@Repository
public interface OrderItem_OptionList_OptionRepository extends JpaRepository<OrderItem_OptionList_Option, Integer> {
}
