package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
public class Account {

	@Id
	private UUID id;

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
	private LocalDateTime createdAt;

	@Column(nullable = false, length = 50)
	private String email;

	@Column(nullable = false)
	private boolean isEmailVerified;

	@Column(length = 20)
	private String phoneNumber;

	private UUID conversationId;

	@Column(nullable = false)
	@ColumnDefault("1")
	@Builder.Default
	private boolean isActive = true;
}