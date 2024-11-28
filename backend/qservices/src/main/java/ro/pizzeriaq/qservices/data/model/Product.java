package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToOne
	@JoinColumn(name = "id_category", nullable = false)
	private ProductCategory category;


	@ManyToMany(mappedBy = "products")
	private List<OptionList> optionLists;


	@ManyToMany(mappedBy = "products")
	private List<Coupon> coupons;


	@OneToMany(mappedBy = "product")
	private List<OrderItem> orderItems;


	@Column(nullable = false, length = 60)
	private String name;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal price;


	@Column(length = 1000)
	private String description;


	private String image;

	@Column(nullable = false)
	@ColumnDefault("1")
	private boolean isActive = true;
}
