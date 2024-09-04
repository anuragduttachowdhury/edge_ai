package com.edge.ai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edge.ai.objects.UI_AIResponse;
import com.edge.ai.objects.VoiceCommandAnswer;
import com.edge.ai.objects.VoiceCommandQuery;
import com.edge.ai.objects.Container;
import com.edge.ai.service.AIService;
import com.edge.ai.service.DockerService;
import com.edge.ai.service.VoiceCommandService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class FrontendController {

	@Autowired
	DockerService dockerService;

	@Autowired
	AIService aiService;
	
	@Autowired
	VoiceCommandService voiceCommandService;

	@GetMapping("/container_list")
	public List<Container> fetchContainer() {
		return dockerService.fetchContainers();
	}

//	@GetMapping("/container_stats/{id}")
//	public List<ContainerStats> fetchContainerStats(@PathVariable String id){
//		return new List<ContainerStats>() {
//		};
//	}
	
	@PostMapping("/command")
	public VoiceCommandAnswer voiceListener(@RequestBody VoiceCommandQuery voiceCommandQuery) {
//		String[] commands = voiceCommandQuery.getQuery().split(" ");
//		Integer matchScore = 0;
//		for (int i = 0; i <= commands.length - 1; i++) {
//			if (commands[i].equals("docker") || commands[i].equals("container") || commands[i].equals("status") || commands[i].equals("containers")) {
//				matchScore++;
//			}
//		}
//		if (matchScore >= 2) {
//			VoiceCommandAnswer answer = new VoiceCommandAnswer("You have asked for Docker Insights.");
//			return answer;
//		}
//		VoiceCommandAnswer answer = new VoiceCommandAnswer("I didn't get you what you actually asked for.");
		return voiceCommandService.voiceListener(voiceCommandQuery);
	}

	@GetMapping("/ai/overall_statistics")
	public UI_AIResponse overallStats() {
		return aiService.overallStats();
	}

}
