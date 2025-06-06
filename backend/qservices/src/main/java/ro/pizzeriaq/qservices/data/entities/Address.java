package ro.pizzeriaq.qservices.data.entities;

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


	@Column(nullable = false)
	private String addressString;


	@Column(nullable = false)
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
				&& Objects.equals(addressString, other.addressString)
				&& isPrimary == other.isPrimary
				&& isActive == other.isActive;
	}

}
