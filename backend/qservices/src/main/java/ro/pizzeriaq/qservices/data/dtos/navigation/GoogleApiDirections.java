package ro.pizzeriaq.qservices.data.dtos.navigation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GoogleApiDirections {

	private List<Route> routes;

	private String status;

	@JsonProperty("error_message")
	private String errorMessage;


	@Data
	public static class Route {

		@JsonProperty("overview_polyline")
		private Polyline overviewPolyline;


		@Data
		public static class Polyline {
			private String points;
		}

	}

}
