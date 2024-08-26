package com.edge.ai.service;

import java.util.List;

import com.edge.ai.objects.Container;

public interface DockerService {
	
	public List<Container> fetchContainers();
}
