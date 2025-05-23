package ro.pizzeriaq.qservices.service.DTO.typesense;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;


@Data
public class SearchResult<TDocument> {

	@JsonProperty("facet_counts")
	private List<Object> facetCounts;

	private int found;

	private List<Hit<TDocument>> hits;

	@JsonProperty("out_of")
	private int outOf;

	private int page;

	@JsonProperty("request_params")
	private RequestParams requestParams;

	private boolean searchCutoff;

	@JsonProperty("search_time_ms")
	private int searchTimeMs;


	@Data
	public static class RequestParams {

		@JsonProperty("collection_name")
		private String collectionName;

		@JsonProperty("first_q")
		private String firstQ;

		@JsonProperty("per_page")
		private int perPage;

		private String q;
	}


	@Data
	public static class Hit<TDocument> {

		private TDocument document;

		private Highlight highlight;

		private List<Highlight.Detail> highlights;

		@JsonProperty("text_match")
		private long textMatch;

		@JsonProperty("text_match_info")
		private TextMatchInfo textMatchInfo;

		@JsonProperty("vector_distance")
		private double vectorDistance;


		@Data
		public static class Highlight {

			private Detail ingredients;


			@Data
			public static class Detail {

				private String field;

				@JsonProperty("matched_tokens")
				private List<String> matchedTokens;

				private String snippet;

			}
		}


		@Data
		public static class TextMatchInfo {

			@JsonProperty("best_field_score")
			private String bestFieldScore;

			@JsonProperty("best_field_weight")
			private int bestFieldWeight;

			@JsonProperty("fields_matched")
			private int fieldsMatched;

			@JsonProperty("num_tokens_dropped")
			private int numTokensDropped;

			private String score;

			@JsonProperty("tokens_matched")
			private int tokensMatched;

			@JsonProperty("typo_prefix_score")
			private int typoPrefixScore;

		}
	}

}
