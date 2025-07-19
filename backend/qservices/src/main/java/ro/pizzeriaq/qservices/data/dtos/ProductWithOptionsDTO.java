package ro.pizzeriaq.qservices.data.dtos;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record ProductWithOptionsDto(
		int id,
		String name,
		String subtitle,
		String description,
		BigDecimal price,
		String imageName,
		long imageVersion,
		int categoryId,
		List<OptionListDto> optionLists,
		boolean isActive
) {
}
