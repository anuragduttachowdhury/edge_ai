package com.edge.ai.service.Implementation;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edge.ai.objects.VoiceCommandAnswer;
import com.edge.ai.objects.VoiceCommandQuery;
import com.edge.ai.service.AIService;
import com.edge.ai.service.VoiceCommandService;

@Service
public class VoiceCommandServiceImpl implements VoiceCommandService {
	
	@Autowired
	AIService aiService;

	public VoiceCommandAnswer querySelector(VoiceCommandQuery commandQuery) {
		String[] commands = commandQuery.getQuery().split(" ");
		String matchType = new String();
		Integer matchScore = 0;
		
		for (int i = 0; i <= commands.length - 1; i++) {
			if (commands[i].equals("docker") || commands[i].equals("container") || commands[i].equals("status")
					|| commands[i].equals("containers")) {
				matchScore++;
				if (matchScore >= 2) {
					matchType = "overallInsights";
					break;
				}
			} else if (commands[i].equals("introduction") || commands[i].equals("introduce")
					|| commands[i].equals("yourself") || commands[i].equals("you") || commands[i].equals("who")) {
				matchScore++;
				if (matchScore >= 2) {
					matchType = "introduction";
					break;
				}
			}
		}

		VoiceCommandAnswer answer = new VoiceCommandAnswer();
		switch (matchType) {
		case "introduction":
			answer = introduction();
			break;
		case "overallInsights":
			answer = overallInsights();
			break;
		default:
			answer = invalidQuery();
		}
		return answer;
	}

	public VoiceCommandAnswer introduction() {
		return new VoiceCommandAnswer("Hi, this is Niral EDGE AI on this side. I am designed to offer high-performance AI capabilities in environments where traditional cloud-based solutions might not be practical. I can be used in a variety of applications, such as smart cities, industrial automation, and IoT (Internet of Things) devices. I can enable real-time analytics and decision-making at the edge of the network.");
	}

	public VoiceCommandAnswer overallInsights() {
		return new VoiceCommandAnswer(aiService.overallStats().getResponse());
	}

	public VoiceCommandAnswer invalidQuery() {
		return new VoiceCommandAnswer("Sorry, I wont be able you to help you regarding that.");
	}

	@Override
	public VoiceCommandAnswer voiceListener(VoiceCommandQuery commandQuery) {
		// TODO Auto-generated method stub
		try {
		    TimeUnit.SECONDS.sleep(10);
		} catch (InterruptedException ie) {
		    Thread.currentThread().interrupt();
		}
		return querySelector(commandQuery);
	}

}
