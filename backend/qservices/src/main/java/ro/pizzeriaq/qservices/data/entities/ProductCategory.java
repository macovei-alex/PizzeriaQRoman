package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "productcategory")
public class ProductCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@OneToMany(mappedBy = "category")
	private List<Product> products;


	@Column(nullable = false, unique = true, length = 40)
	private String name;


	@Column(nullable = false, unique = true)
	private Integer sortId;
}
