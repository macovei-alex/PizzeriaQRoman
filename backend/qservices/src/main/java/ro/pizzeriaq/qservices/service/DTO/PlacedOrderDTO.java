package ro.pizzeriaq.qservices.service.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class PlacedOrderDTO {

	private String additionalNotes;

	@NotNull(message = "The list of items in an order cannot be null")
	@Size(min = 1, message = "An order cannot contain 0 or less items")
	private List<Item> items;


	@Data
	@Builder
	public static class Item {

		@Min(value = 1, message = "You cannot order a product with the ID less than or equal to 0")
		private int productId;

		@Min(value = 1, message = "You cannot order an amount of items less than or equal to 0")
		private int count;

		private List<OptionList> optionLists;


		@Data
		public static class OptionList {

			@Min(value = 1, message = "You cannot add an option list with the ID less than or equal to 0")
			private int optionListId;

			@NotNull
			@Size(min = 1, message = "An option list cannot contain 0 or less options")
			private List<Option> options;


			@Data
			public static class Option {

				@Min(value = 1, message = "You cannot add an option with the ID less than or equal to 0")
				private int optionId;

				@Min(value = 1, message = "You have an amount of options less than or equal to 0")
				private int count;
			}
		}
	}
}
