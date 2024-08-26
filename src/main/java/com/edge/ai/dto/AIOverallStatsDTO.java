package com.edge.ai.dto;

public class AIOverallStatsDTO {

	private String Image;
	private String Status;
	private String State;

	public String getImage() {
		return Image;
	}

	public void setImage(String image) {
		Image = image;
	}

	public String getStatus() {
		return Status;
	}

	public void setStatus(String status) {
		Status = status;
	}

	public String getState() {
		return State;
	}

	public void setState(String state) {
		State = state;
	}

	public AIOverallStatsDTO(String image, String status, String state) {
		super();
		Image = image;
		Status = status;
		State = state;
	}

	public AIOverallStatsDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

}
