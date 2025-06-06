package ro.pizzeriaq.qservices.data.dtos.typesense;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.pizzeriaq.qservices.data.dtos.typesense.documents.ConversationsCollectionDocument;

@Data
@EqualsAndHashCode(callSuper = true)
public class TypesenseConversationResultDto extends SearchResult<ConversationsCollectionDocument> {
}
