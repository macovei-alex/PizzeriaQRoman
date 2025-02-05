package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@ManyToMany
	@JoinTable(
			name = "account_coupon",
			joinColumns = @JoinColumn(name = "id_account"),
			inverseJoinColumns = @JoinColumn(name = "id_coupon")
	)
	private List<Coupon> coupons;


	@OneToMany(mappedBy = "account")
	private List<Order> orders;


	@OneToMany(mappedBy = "account")
	private List<Address> addresses;


	@Column(nullable = false, columnDefinition = "DATETIME")
	private LocalDateTime createdTimestamp;


	@Column(nullable = false, length = 20)
	private String phoneNumber;


	@Column(nullable = false)
	@ColumnDefault("1")
	@Builder.Default
	private boolean isActive = true;
}