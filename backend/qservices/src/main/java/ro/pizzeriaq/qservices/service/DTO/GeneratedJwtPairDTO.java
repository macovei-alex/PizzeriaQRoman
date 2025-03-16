package ro.pizzeriaq.qservices.service.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GeneratedJwtPairDTO {

	private String accessToken;
	private String refreshToken;

}
