package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
public class AddressType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@OneToMany(mappedBy = "addressType")
	@EqualsAndHashCode.Exclude
	private List<Address> addresses;


	@Column(nullable = false, unique = true, length = 30)
	private String name;

}
