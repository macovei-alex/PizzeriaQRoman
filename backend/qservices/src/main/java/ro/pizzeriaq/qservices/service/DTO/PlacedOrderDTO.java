package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@Builder
public class PlacedOrderDTO {

	private String additionalNotes;

	private int addressId;

	@Valid
	@NotEmpty(message = "The list of items in an order cannot be null or empty")
	private List<Item> items;


	@Data
	@Builder
	public static class Item {

		@Min(value = 1, message = "You cannot order a product with the ID less than or equal to 0")
		private int productId;

		@Min(value = 1, message = "You cannot order an amount of items less than or equal to 0")
		private int count;

		@Valid
		@NotNull(message = "The list of options for any item cannot be null, only empty if no options were selected")
		private List<OptionList> optionLists;


		@Data
		@Builder
		public static class OptionList {

			@Min(value = 1, message = "You cannot add an option list with the ID less than or equal to 0")
			private int optionListId;

			@NotEmpty(message = "An option list cannot be null or empty")
			@Valid
			private List<Option> options;


			@Data
			@Builder
			public static class Option {

				@Min(value = 1, message = "You cannot add an option with the ID less than or equal to 0")
				private int optionId;

				@Min(value = 1, message = "You have an amount of options less than or equal to 0")
				private int count;
			}
		}
	}
}
