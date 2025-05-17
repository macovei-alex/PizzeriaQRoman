package ro.pizzeriaq.qservices.service.DTO.TypesenseResponse;

import lombok.Data;

import java.util.List;


@Data
public class TypesenseResponseDto {

	private Conversation conversation;
	private List<SearchResult> results;

}
