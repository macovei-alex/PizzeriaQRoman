package ro.pizzeriaq.qservices.exceptions.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class LogicalErrorResponse {

	private LogicalErrorCode code;
	private String message;
	private Map<String, Object> details;

}
