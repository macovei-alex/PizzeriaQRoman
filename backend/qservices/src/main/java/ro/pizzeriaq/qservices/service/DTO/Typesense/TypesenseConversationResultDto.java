package ro.pizzeriaq.qservices.service.DTO.Typesense;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.pizzeriaq.qservices.service.DTO.Typesense.documents.ConversationsCollectionDocument;

@Data
@EqualsAndHashCode(callSuper = true)
public class TypesenseConversationResultDto extends SearchResult<ConversationsCollectionDocument> {
}
