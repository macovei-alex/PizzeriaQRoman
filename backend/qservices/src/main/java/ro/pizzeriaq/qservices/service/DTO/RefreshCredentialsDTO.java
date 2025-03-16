package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RefreshCredentialsDTO {

	@NotEmpty(message = "Refresh token cannot be empty")
	private String refreshToken;

}
