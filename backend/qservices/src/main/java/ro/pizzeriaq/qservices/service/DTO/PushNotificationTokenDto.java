package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PushNotificationTokenDto {

	@NotBlank
	private String token;

}
