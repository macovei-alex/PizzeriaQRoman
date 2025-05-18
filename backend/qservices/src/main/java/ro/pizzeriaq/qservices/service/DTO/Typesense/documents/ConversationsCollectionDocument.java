package ro.pizzeriaq.qservices.service.DTO.Typesense.documents;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;

@Data
public class ConversationsCollectionDocument {

	private String id;

	@JsonProperty("conversation_id")
	private UUID conversationId;

	private String message;

	@JsonProperty("model_id")
	private String modelId;

	private String role;

	private int timestamp;

}
