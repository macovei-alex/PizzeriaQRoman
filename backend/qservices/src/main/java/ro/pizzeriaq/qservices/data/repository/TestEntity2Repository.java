package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.model.TestEntity2;

@Repository
public interface TestEntity2Repository extends JpaRepository<TestEntity2, Integer> {
}
