package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "productcategory")
public class ProductCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false, unique = true)
	private Integer id;


	@OneToMany(mappedBy = "category")
	private List<Product> products;


	@Column(nullable = false, unique = true, length = 40)
	private String name;


	@Column(nullable = false, unique = true)
	private Integer sortId;
}
