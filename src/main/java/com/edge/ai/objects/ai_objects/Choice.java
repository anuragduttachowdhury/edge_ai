package com.edge.ai.objects.ai_objects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Choice {

    @JsonProperty("index")
    private int index;

    @JsonProperty("message")
    private Message message;

    @JsonProperty("logprobs")
    private Object logprobs;  // This can be null or a different structure based on the API

    @JsonProperty("finish_reason")
    private String finishReason;

    // Getters and setters
    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public Object getLogprobs() {
        return logprobs;
    }

    public void setLogprobs(Object logprobs) {
        this.logprobs = logprobs;
    }

    public String getFinishReason() {
        return finishReason;
    }

    public void setFinishReason(String finishReason) {
        this.finishReason = finishReason;
    }
}

