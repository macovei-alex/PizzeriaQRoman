package ro.pizzeriaq.qservices.service.DTO;

import lombok.Data;

@Data
public class PushNotificationDto {

	private String to;
	private String title;
	private String body;

}
