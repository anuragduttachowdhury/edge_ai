package com.edge.ai.objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Container {

	@Id
	private String id;
	private String Names;
	private String Image;
	private String State;
	private String Status;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNames() {
		return Names;
	}

	public void setNames(String names) {
		Names = names;
	}

	public String getImage() {
		return Image;
	}

	public void setImage(String image) {
		Image = image;
	}

	public String getState() {
		return State;
	}

	public void setState(String state) {
		State = state;
	}

	public String getStatus() {
		return Status;
	}

	public void setStatus(String status) {
		Status = status;
	}

	public Container(String id, String names, String image, String state, String status) {
		super();
		this.id = id;
		Names = names;
		Image = image;
		State = state;
		Status = status;
	}

	public Container() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

}