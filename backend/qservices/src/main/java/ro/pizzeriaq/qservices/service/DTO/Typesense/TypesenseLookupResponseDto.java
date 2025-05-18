package ro.pizzeriaq.qservices.service.DTO.Typesense;

import lombok.Data;
import ro.pizzeriaq.qservices.service.DTO.Typesense.documents.LookupCollectionDocument;

import java.util.List;


@Data
public class TypesenseLookupResponseDto {

	private Conversation conversation;
	private List<SearchResult<LookupCollectionDocument>> results;

}
