package com.edge.ai.objects.ai_objects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Message {

    @JsonProperty("role")
    private String role;

    @JsonProperty("content")
    private String content;

    // Getters and setters
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
}
