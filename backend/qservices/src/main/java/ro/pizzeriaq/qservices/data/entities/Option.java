package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "options")
public class Option {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToMany(mappedBy = "options")
	private List<OptionList> optionLists;


	@Column(nullable = false, length = 50)
	private String name;


	@Column(length = 100)
	private String additionalDescription;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal price;


	@Column(nullable = false)
	private int minCount;


	@Column(nullable = false)
	private int maxCount;
}
