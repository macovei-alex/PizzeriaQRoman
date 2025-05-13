package ro.pizzeriaq.qservices.data.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;
import java.util.Objects;

@Getter
@Setter
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


	private boolean isPrimary;


	@Column(nullable = false)
	@ColumnDefault("1")
	@Builder.Default
	private boolean isActive = true;


	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof Address other)) {
			return false;
		}

		return Objects.equals(id, other.id)
				&& Objects.equals(account == null ? null : account.getId(), other.account == null ? null : other.account.getId())
				&& Objects.equals(addressType, other.addressType)
				&& Objects.equals(city, other.city)
				&& Objects.equals(street, other.street)
				&& Objects.equals(streetNumber, other.streetNumber)
				&& Objects.equals(block, other.block)
				&& floor == other.floor
				&& Objects.equals(apartment, other.apartment)
				&& isPrimary == other.isPrimary
				&& isActive == other.isActive;
	}

}
