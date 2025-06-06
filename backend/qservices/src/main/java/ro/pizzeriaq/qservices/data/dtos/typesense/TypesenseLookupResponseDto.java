package ro.pizzeriaq.qservices.data.dtos.typesense;

import lombok.Data;
import ro.pizzeriaq.qservices.data.dtos.typesense.documents.LookupCollectionDocument;

import java.util.List;


@Data
public class TypesenseLookupResponseDto {

	private Conversation conversation;
	private List<SearchResult<LookupCollectionDocument>> results;

}
