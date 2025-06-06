package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PushNotificationRequestDto {

	@NotBlank
	private String title;

	@NotBlank
	private String body;

}
