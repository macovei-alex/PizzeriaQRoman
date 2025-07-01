package ro.pizzeriaq.qservices.data.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PushToken {

	@Id
	@Column(nullable = false, updatable = false, unique = true)
	private String id;

}
