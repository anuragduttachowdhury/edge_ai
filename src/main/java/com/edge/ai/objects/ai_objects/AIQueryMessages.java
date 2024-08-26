package com.edge.ai.objects.ai_objects;

public class AIQueryMessages {

	private String role;
	private String content;

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public AIQueryMessages(String role, String content) {
		super();
		this.role = role;
		this.content = content;
	}

	public AIQueryMessages() {
		super();
		// TODO Auto-generated constructor stub
	}

}
