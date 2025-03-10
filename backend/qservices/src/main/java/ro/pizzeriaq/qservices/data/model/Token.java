package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Token {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;


	@OneToOne(mappedBy = "token")
	private Account account;


	@Column(nullable = false, length = 256)
	private String accessToken;


	@Column(nullable = false, length = 256)
	private String refreshToken;
}
