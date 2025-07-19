package ro.pizzeriaq.qservices.data.dtos;

import lombok.Builder;

@Builder
public record ProductCategoryDto(
		int id,
		String name
) {
}
