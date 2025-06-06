package ro.pizzeriaq.qservices.data.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PushNotificationDto {

	private String to;
	private String title;
	private String body;

}
