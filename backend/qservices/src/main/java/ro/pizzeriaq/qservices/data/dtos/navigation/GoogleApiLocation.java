package ro.pizzeriaq.qservices.data.dtos.navigation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleApiLocation {

	@JsonProperty("lat")
	private double latitude;

	@JsonProperty("lng")
	private double longitude;
}
