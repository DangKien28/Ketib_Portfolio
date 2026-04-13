package com.portfolio.java_project.repositories;

import com.portfolio.java_project.models.CommentModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<CommentModel, String> {
    List<CommentModel> findByProjectId(Integer projectId);
}
