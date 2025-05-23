package ro.pizzeriaq.qservices.service.DTO.typesense;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class Conversation {

	private String answer;

	@JsonProperty("conversation_history")
	private History conversationHistory;

	@JsonProperty("conversation_id")
	private UUID conversationId;

	private String query;


	@Data
	public static class History {

		private List<MessagePair> conversation;

		@JsonProperty("last_updated")
		private long lastUpdated;


		@Data
		public static class MessagePair {

			private String user;

			private String assistant;

		}
	}
}