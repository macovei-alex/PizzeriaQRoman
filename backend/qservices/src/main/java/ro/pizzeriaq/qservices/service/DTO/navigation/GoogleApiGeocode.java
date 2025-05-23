package ro.pizzeriaq.qservices.service.DTO.navigation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GoogleApiGeocode {

	List<Result> results;
	private String status;


	@Data
	public static class Result {

		@JsonProperty("formatted_address")
		private String formattedAddress;

		private Geometry geometry;

		@JsonProperty("place_id")
		private String placeId;

		private String[] types;


		@Data
		public static class Geometry {

			private Location location;

			@JsonProperty("location_type")
			private String locationType;

			private Viewport viewport;


			@Data
			public static class Location {
				private double lat;
				private double lng;
			}


			@Data
			public static class Viewport {
				private Location northeast;
				private Location southwest;
			}

		}
	}
}
