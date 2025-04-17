package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.entity.OptionList;
import ro.pizzeriaq.qservices.data.entity.Product;

import java.util.List;

@Repository
public interface OptionListRepository extends JpaRepository<OptionList, Integer> {

	@Query("""
		SELECT DISTINCT ol FROM OptionList ol
		LEFT JOIN FETCH ol.options
		WHERE :product MEMBER OF ol.products
	""")
	List<OptionList> findAllByProductPreloadOptions(@Param("product") Product product);
}
