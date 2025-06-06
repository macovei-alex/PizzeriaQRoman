package ro.pizzeriaq.qservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entities.PushToken;

@Repository
public interface PushTokenRepository extends JpaRepository<PushToken, String> {
}
