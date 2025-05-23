package ro.pizzeriaq.qservices.service.DTO.typesense;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.pizzeriaq.qservices.service.DTO.typesense.documents.ConversationsCollectionDocument;

@Data
@EqualsAndHashCode(callSuper = true)
public class TypesenseConversationResultDto extends SearchResult<ConversationsCollectionDocument> {
}
