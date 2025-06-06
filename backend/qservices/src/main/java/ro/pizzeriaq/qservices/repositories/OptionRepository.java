package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Integer> {
}
