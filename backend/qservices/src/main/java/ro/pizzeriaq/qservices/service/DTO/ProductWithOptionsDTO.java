package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class ProductWithOptionsDTO {

	private int id;
	private String name;
	private String subtitle;
	private String description;
	private BigDecimal price;
	private String imageName;
	private long imageVersion;
	private int categoryId;
	private List<OptionListDTO> optionLists;

}
