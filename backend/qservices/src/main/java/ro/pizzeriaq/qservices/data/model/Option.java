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
	private String additionalDescription = null;


	@Column(nullable = false, precision = 8, scale = 2)
	private BigDecimal price;


	@Column(nullable = false)
	@ColumnDefault("0")
	private int minCount = 0;


	@Column(nullable = false)
	@ColumnDefault("2147483647")
	private int maxCount = Integer.MAX_VALUE;
}
