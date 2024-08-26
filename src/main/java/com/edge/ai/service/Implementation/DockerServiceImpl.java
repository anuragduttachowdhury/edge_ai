package com.edge.ai.service.Implementation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.edge.ai.objects.Container;
import com.edge.ai.repository.DockerRepo;
import com.edge.ai.service.DockerService;

@Service
@EnableScheduling
public class DockerServiceImpl implements DockerService {

	@Autowired
	DockerRepo dockerRepo;

	@Value("${docker.host.url}")
	private String dockerHostUrl;

	@Value("${docker.host.port}")
	private String dockerHostPort;

	private Boolean trigger = false;

	public WebClient callWebClient() {
		WebClient webClient = WebClient.create("http://" + dockerHostUrl + ":" + dockerHostPort + "/v1.46");
		return webClient;
	}

	@Scheduled(fixedDelay = 10000)
	public void getContainers() {
		List<HashMap<String, Object>> responseMono = callWebClient().get().uri(uriBuilder -> uriBuilder
			    .path("/containers/json")
			    .queryParam("all", true)
			    .build())
				.retrieve()
				.bodyToMono(new ParameterizedTypeReference<List<HashMap<String, Object>>>() {
				}).block();

//		DeSerialize and Save the Response
		responseMono.forEach(response -> {
			if (dockerRepo.existsById(response.get("Id").toString()) != true) {
				Container container = new Container(response.get("Id").toString(), response.get("Names").toString(),
						response.get("Image").toString(), response.get("State").toString(),
						response.get("Status").toString());
				dockerRepo.save(container);
			} else {
				Container container = dockerRepo.findById(response.get("Id").toString())
						.orElseThrow(() -> new RuntimeException("Model not found"));
				container.setState(response.get("State").toString());
				container.setStatus(response.get("Status").toString());
				dockerRepo.save(container);
			}

		});

//		Cleaning Old Backlog Data
		List<Container> containers = new ArrayList<>();
		containers = dockerRepo.findAll();

		containers.forEach(container -> {
			trigger = false;
			responseMono.forEach(response -> {
				if(container.getId().equals(response.get("Id"))) {
					trigger = true;
				}
			});
			if (trigger == false) {
				dockerRepo.deleteById(container.getId());
				System.out.println("Deleted: "+container.getId());
			}
		});
	}

	@Override
	public List<Container> fetchContainers() {
		return dockerRepo.findAll();
	}

}
