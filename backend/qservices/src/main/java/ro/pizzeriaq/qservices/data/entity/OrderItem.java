package ro.pizzeriaq.qservices.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orderitem")
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToOne
	@JoinColumn(name = "id_order", nullable = false)
	private Order order;


	@ManyToOne
	@JoinColumn(name = "id_product", nullable = false)
	private Product product;


	@OneToMany(mappedBy = "orderItem")
	private List<OrderItem_OptionList_Option> options;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal totalPrice;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal totalPriceWithDiscount;


	@Column(nullable = false)
	private int count;
}
