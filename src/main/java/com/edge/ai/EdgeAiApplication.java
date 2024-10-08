package com.edge.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EdgeAiApplication implements CommandLineRunner {
	
	Logger logger = LoggerFactory.getLogger(EdgeAiApplication.class);
	

	public static void main(String[] args) {
		SpringApplication.run(EdgeAiApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
	}
}
