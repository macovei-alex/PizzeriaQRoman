package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Token {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;


	@OneToOne(mappedBy = "token")
	private Account account;


	@Column(nullable = false, length = 2048)
	private String accessToken;


	@Column(nullable = false, length = 2048)
	private String refreshToken;
}
