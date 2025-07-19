package ro.pizzeriaq.qservices.data.dtos;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProductDto(
		int id,
		String name,
		String subtitle,
		String description,
		BigDecimal price,
		String imageName,
		long imageVersion,
		int categoryId
) {
}
