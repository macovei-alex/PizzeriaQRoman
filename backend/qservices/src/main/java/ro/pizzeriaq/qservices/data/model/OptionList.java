package ro.pizzeriaq.qservices.data.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "optionlist")
public class OptionList {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToMany(mappedBy = "optionLists")
	private List<Product> products;


	@ManyToMany
	@JoinTable(
			name = "optionlist_option",
			joinColumns = @JoinColumn(name = "id_optionlist"),
			inverseJoinColumns = @JoinColumn(name = "id_option")
	)
	private List<Option> options;


	@OneToMany(mappedBy = "optionList")
	private List<OrderItem_OptionList_Option> orderItemOptionListOptions;


	@Column(nullable = false, length = 80)
	private String text = null;


	@Column(nullable = false)
	@ColumnDefault("0")
	private int minChoices = 0;


	@Column(nullable = false)
	@ColumnDefault("2147483647")
	private int maxChoices = Integer.MAX_VALUE;


	@Column(nullable = false)
	@ColumnDefault("1")
	private boolean isActive = true;


	public void addProductSync(Product product) {
		products.add(product);
		product.getOptionLists().add(this);
	}


	public void removeProductSync(Product product) {
		products.remove(product);
		product.getOptionLists().remove(this);
	}
}
