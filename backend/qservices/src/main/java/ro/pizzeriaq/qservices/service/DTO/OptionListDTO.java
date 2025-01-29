package ro.pizzeriaq.qservices.service.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class OptionListDTO {

	private int id;
	private String text;
	private int minChoices;
	private int maxChoices;
	private List<OptionDTO> options;

}
