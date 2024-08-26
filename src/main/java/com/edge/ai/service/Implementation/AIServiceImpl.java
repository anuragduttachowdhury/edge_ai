package com.edge.ai.service.Implementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.edge.ai.dto.AIOverallStatsDTO;
import com.edge.ai.objects.UI_AIResponse;
import com.edge.ai.objects.ai_objects.AIQuery;
import com.edge.ai.objects.ai_objects.AIQueryMessages;
import com.edge.ai.objects.ai_objects.ChatCompletionResponse;
import com.edge.ai.objects.ai_objects.Choice;
import com.edge.ai.objects.ai_objects.Message;
import com.edge.ai.objects.Container;
import com.edge.ai.repository.DockerRepo;
import com.edge.ai.service.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIServiceImpl implements AIService {

	@Value("${ai.host.url}")
	private String aiHostUrl;

	@Value("${ai.host.port}")
	private String aiHostPort;

	@Autowired
	DockerRepo dockerRepo;

	public WebClient callWebClient() {
		WebClient webClient = WebClient.create("http://" + aiHostUrl + ":" + aiHostPort + "/v1");
		return webClient;
	}

	@Override
	public UI_AIResponse overallStats() {

//		Structuring Data for AI Response
		List<AIOverallStatsDTO> aiOverallStatsDTOs = new ArrayList<>();
		List<Container> containers = dockerRepo.findAll();
		containers.forEach(container -> {
			AIOverallStatsDTO aiOverallStatsDTO = new AIOverallStatsDTO(container.getImage(), container.getStatus(),
					container.getState());
			aiOverallStatsDTOs.add(aiOverallStatsDTO);
		});

		ObjectMapper objectMapper = new ObjectMapper();

		try {
			// Convert DTO to JSON string
			String jsonString = objectMapper.writeValueAsString(aiOverallStatsDTOs);

//			Generating Payload and Query for AI Model
			List<AIQueryMessages> aiQueryMessages = new ArrayList<>();
			AIQueryMessages aiQuery1 = new AIQueryMessages("user", jsonString);
			AIQueryMessages aiQuery2 = new AIQueryMessages("user", "What is the status of the Docker Containers ?");
			aiQueryMessages.add(aiQuery1);
			aiQueryMessages.add(aiQuery2);


			AIQuery aiQuery = new AIQuery(aiQueryMessages, 0.0, -1,false);
			
//				Sending Query to AI Model and Getting Response
			ChatCompletionResponse responseMono = callWebClient().post().uri("/chat/completions").bodyValue(aiQuery)
					.retrieve().bodyToMono(ChatCompletionResponse.class).block();

			List<Choice> choices = responseMono.getChoices();
			Choice choice = choices.get(0);
			Message message = choice.getMessage();
			UI_AIResponse response = new UI_AIResponse(message.getContent());

			return response;

		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

}
