package com.edge.ai.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.edge.ai.objects.Container;

@Repository
public interface DockerRepo extends MongoRepository<Container, String>{
}
