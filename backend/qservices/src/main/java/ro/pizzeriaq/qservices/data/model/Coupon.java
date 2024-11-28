package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Coupon {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToMany(mappedBy = "coupons")
	private List<Account> accounts;


	@ManyToMany
	@JoinTable(
			name = "coupon_product",
			joinColumns = @JoinColumn(name = "id_coupon"),
			inverseJoinColumns = @JoinColumn(name = "id_product")
	)
	private List<Product> products;


	@OneToMany(mappedBy = "coupon")
	private List<Order> orders;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal discount;


	@Column(nullable = false, columnDefinition = "DATETIME")
	@ColumnDefault("NOW()")
	private LocalDateTime startDate = LocalDateTime.now();


	@Column(nullable = false, columnDefinition = "DATETIME")
	@ColumnDefault("(DATE_ADD(NOW(), INTERVAL 1 MONTH))")
	private LocalDateTime endDate = LocalDateTime.now().plusMonths(1);
}
