package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.PushToken;

@Repository
public interface PushTokenRepository extends JpaRepository<PushToken, String> {
}
