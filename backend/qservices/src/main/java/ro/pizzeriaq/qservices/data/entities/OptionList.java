package ro.pizzeriaq.qservices.data.entities;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "optionlist")
public class OptionList {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false, unique = true)
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
	private String text;


	@Column(nullable = false)
	private int minChoices;


	@Column(nullable = false)
	private int maxChoices;


	@Column(nullable = false)
	@ColumnDefault("1")
	@Builder.Default
	private boolean isActive = true;
}
