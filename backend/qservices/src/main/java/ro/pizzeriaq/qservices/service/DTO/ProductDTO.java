package ro.pizzeriaq.qservices.service.DTO;

import lombok.Data;
import ro.pizzeriaq.qservices.data.model.Product;

import java.math.BigDecimal;

@Data
public class ProductDTO {

	private int id;
	private String name;
	private String subtitle;
	private String description;
	private BigDecimal price;
	private String imageUrl;
	private int categoryId;


	public static ProductDTO fromEntity(Product product) {
		if (product == null) {
			return null;
		}

		ProductDTO productDTO = new ProductDTO();
		productDTO.setId(product.getId());
		productDTO.setName(product.getName());
		productDTO.setSubtitle(product.getSubtitle());
		productDTO.setDescription(product.getDescription());
		productDTO.setPrice(product.getPrice());
		productDTO.setImageUrl(product.getImage());
		productDTO.setCategoryId(product.getCategory().getId());
		return productDTO;
	}
}
