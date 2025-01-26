package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToOne
	@JoinColumn(name = "id_account", nullable = false)
	private Account account;


	@ManyToOne
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
