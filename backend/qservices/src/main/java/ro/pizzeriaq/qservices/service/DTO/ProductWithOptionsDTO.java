package ro.pizzeriaq.qservices.service.DTO;

import lombok.Data;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.data.model.Product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class ProductWithOptionsDTO {

	private int id;
	private String name;
	private String subtitle;
	private String description;
	private BigDecimal price;
	private String imageUrl;
	private int categoryId;
	private List<OptionListDTO> optionLists;


	public static ProductWithOptionsDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		ProductWithOptionsDTO productDto = new ProductWithOptionsDTO();
		productDto.setId(product.getId());
		productDto.setName(product.getName());
		productDto.setSubtitle(product.getSubtitle());
		productDto.setDescription(product.getDescription());
		productDto.setPrice(product.getPrice());
		productDto.setImageUrl(product.getImage());
		productDto.setCategoryId(product.getCategory().getId());

		List<OptionListDTO> optionListDTOS  = new ArrayList<>();
		for (OptionList optionList : product.getOptionLists()) {
			optionListDTOS.add(OptionListDTO.fromEntity(optionList));
		}

		productDto.setOptionLists(optionListDTOS);

		return productDto;
	}
}
