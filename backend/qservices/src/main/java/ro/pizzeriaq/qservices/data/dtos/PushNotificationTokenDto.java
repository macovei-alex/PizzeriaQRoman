package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PushNotificationTokenDto {

	@NotBlank
	private String token;

}
