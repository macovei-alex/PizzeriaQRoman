package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false, unique = true)
	private Integer id;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_category", nullable = false)
	private ProductCategory category;


	@ManyToMany
	@JoinTable(
			name = "product_optionlist",
			joinColumns = @JoinColumn(name = "id_product"),
			inverseJoinColumns = @JoinColumn(name = "id_optionlist")
	)
	private List<OptionList> optionLists;


	@ManyToMany(mappedBy = "products")
	private List<Coupon> coupons;


	@OneToMany(mappedBy = "product")
	private List<OrderItem> orderItems;


	@Column(nullable = false, length = 60)
	private String name;


	@Column(length = 100)
	private String subtitle;


	@Column(length = 1000)
	private String description;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal price;


	@Column(nullable = false)
	private String imageName;


	@Column(nullable = false)
	@ColumnDefault("1")
	@Builder.Default
	private boolean isActive = true;
}
