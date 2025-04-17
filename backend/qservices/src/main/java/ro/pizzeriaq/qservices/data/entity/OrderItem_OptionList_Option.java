package ro.pizzeriaq.qservices.data.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orderitem_optionlist_option")
public class OrderItem_OptionList_Option {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToOne
	@JoinColumn(name = "id_orderitem", nullable = false)
	private OrderItem orderItem;


	@ManyToOne
	@JoinColumn(name = "id_optionlist", nullable = false)
	private OptionList optionList;


	@ManyToOne
	@JoinColumn(name = "id_option", nullable = false)
	private Option option;


	@Column(nullable = false)
	private int count;
}
