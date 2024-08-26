package com.edge.ai.objects.ai_objects;

import java.util.List;

public class AIQuery {

	private List<AIQueryMessages> messages;
	private Double temperature;
	private Integer max_tokens;
	private Boolean stream;

	public List<AIQueryMessages> getMessages() {
		return messages;
	}

	public void setMessages(List<AIQueryMessages> messages) {
		this.messages = messages;
	}

	public Double getTemperature() {
		return temperature;
	}

	public void setTemperature(Double temperature) {
		this.temperature = temperature;
	}

	public Integer getMax_tokens() {
		return max_tokens;
	}

	public void setMax_tokens(Integer max_tokens) {
		this.max_tokens = max_tokens;
	}

	public Boolean getStream() {
		return stream;
	}

	public void setStream(Boolean stream) {
		this.stream = stream;
	}

	public AIQuery(List<AIQueryMessages> messages, Double temperature, Integer max_tokens, Boolean stream) {
		super();
		this.messages = messages;
		this.temperature = temperature;
		this.max_tokens = max_tokens;
		this.stream = stream;
	}

	public AIQuery() {
		super();
		// TODO Auto-generated constructor stub
	}

}
