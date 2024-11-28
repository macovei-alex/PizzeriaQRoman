package ro.pizzeriaq.qservices.mock;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MockProductDTO {
	private long id;
	private String name;
	private String subtitle;
	private String description;
	private double price;
	private String imageUrl;
	private long categoryId;
}
