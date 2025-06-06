package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
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
	private LocalDateTime startDate;


	@Column(nullable = false, columnDefinition = "DATETIME")
	private LocalDateTime endDate;
}
