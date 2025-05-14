package ro.pizzeriaq.qservices.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_account", nullable = false)
	private Account account;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_address", nullable = false)
	private Address address;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_coupon", nullable = true)
	private Coupon coupon;


	@OneToMany(mappedBy = "order")
	private List<OrderItem> orderItems;


	@Enumerated(EnumType.STRING)
	private OrderStatus orderStatus;


	@Column(nullable = false, columnDefinition = "DATETIME")
	private LocalDateTime orderTimestamp;


	@Column(columnDefinition = "DATETIME")
	private LocalDateTime deliveryTimestamp;


	private Integer estimatedPreparationTime;


	@Column(length = 1000)
	private String additionalNotes;


	@Column(nullable = false, precision= 8, scale = 2)
	private BigDecimal totalPrice;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal totalPriceWithDiscount;
}
