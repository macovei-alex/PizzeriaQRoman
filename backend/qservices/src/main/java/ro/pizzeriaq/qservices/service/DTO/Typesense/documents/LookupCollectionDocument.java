package ro.pizzeriaq.qservices.service.DTO.typesense.documents;

import lombok.Data;

@Data
public class LookupCollectionDocument {

	private String description;
	private String id;
	private String ingredients;
	private String options;
	private String type;

}
