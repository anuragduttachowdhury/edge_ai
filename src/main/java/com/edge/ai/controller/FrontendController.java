package com.edge.ai.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edge.ai.objects.UI_AIResponse;
import com.edge.ai.objects.Container;
import com.edge.ai.service.AIService;
import com.edge.ai.service.DockerService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class FrontendController {
	
	@Autowired
	DockerService dockerService;
	
	@Autowired
	AIService aiService;
	
	@GetMapping("/container_list")
	public List<Container> fetchContainer(){
		return dockerService.fetchContainers();
	}
	
	@GetMapping("/container_stats/{id}")
	public List<ContainerStats> fetchContainerStats(@PathVariable String id){
		return new List<ContainerStats>() {
		};
	}
	
	@GetMapping("/ai/overall_statistics")
	public UI_AIResponse overallStats() {
		return aiService.overallStats();
	}

}
