package ro.pizzeriaq.qservices.data.dtos.navigation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GoogleApiDirections {

	private Route[] routes;


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
