package ro.pizzeriaq.qservices.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Address {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToOne
	@JoinColumn(name = "id_account", nullable = false)
	private Account account;


	@OneToMany(mappedBy = "address")
	private List<Order> orders;


	@ManyToOne
	@JoinColumn(name = "id_address_type", nullable = false)
	private AddressType addressType;


	@Column(nullable = false, length = 40)
	private String city;


	@Column(nullable = false, length = 60)
	private String street;


	@Column(nullable = false, length = 20)
	private String streetNumber;


	@Column(length = 30)
	private String block;


	private int floor;


	@Column(length = 20)
	private String apartment;


	@Column
	private boolean isPrimary;
}
