package ro.pizzeriaq.qservices.data.dtos.navigation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GoogleApiGeocode {

	List<Result> results;

	private String status;

	@JsonProperty("error_message")
	private String errorMessage;


	@Data
	public static class Result {

		@JsonProperty("address_components")
		private List<AddressComponent> addressComponents;

		@JsonProperty("formatted_address")
		private String formattedAddress;

		private Geometry geometry;

		@JsonProperty("place_id")
		private String placeId;

		private String[] types;


		@Data
		public static class Geometry {

			private GoogleApiLocation location;

			@JsonProperty("location_type")
			private String locationType;

			private Viewport viewport;


			@Data
			public static class Viewport {
				private GoogleApiLocation northeast;
				private GoogleApiLocation southwest;
			}
		}

		@Data
		public static class AddressComponent {

			private String longName;

			private String shortName;

			private List<String> types;

			@JsonProperty("postal_code")
			private String postalCode;

			@JsonProperty("locality")
			private String locality;

			@JsonProperty("administrative_area_level_1")
			private String administrativeAreaLevel1;

			@JsonProperty("country")
			private String country;
		}
	}
}
