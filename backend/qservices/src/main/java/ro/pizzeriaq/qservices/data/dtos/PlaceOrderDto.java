package ro.pizzeriaq.qservices.data.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record PlaceOrderDto(
		String additionalNotes,
		int addressId,

		@NotNull
		BigDecimal clientExpectedPrice,

		@Valid
		@NotEmpty(message = "The list of items in an order cannot be null or empty")
		List<Item> items
) {

	@Builder
	public record Item(
			@Min(value = 1, message = "You cannot order a product with the ID less than or equal to 0")
			int productId,

			@Min(value = 1, message = "You cannot order an amount of items less than or equal to 0")
			int count,

			@Valid
			@NotNull(message = "The list of options for any item cannot be null, only empty if no options were selected")
			List<OptionList> optionLists
	) {

		@Builder
		public record OptionList(

				@Min(value = 1, message = "You cannot add an option list with the ID less than or equal to 0")
				int optionListId,

				@NotEmpty(message = "An option list cannot be null or empty")
				@Valid
				List<Option> options
		) {

			@Builder
			public record Option(

					@Min(value = 1, message = "You cannot add an option with the ID less than or equal to 0")
					int optionId,

					@Min(value = 1, message = "You have an amount of options less than or equal to 0")
					int count

			) {
			}
		}
	}
}
