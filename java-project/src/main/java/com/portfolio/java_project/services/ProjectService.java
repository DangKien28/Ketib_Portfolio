package com.portfolio.java_project.services;

import com.portfolio.java_project.models.CommentModel;
import com.portfolio.java_project.models.ProjectModel;
import com.portfolio.java_project.repositories.CommentRepository;
import com.portfolio.java_project.repositories.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final CommentRepository commentRepository;

    public ProjectService(ProjectRepository projectRepository, CommentRepository commentRepository) {
        this.projectRepository = projectRepository;
        this.commentRepository = commentRepository;
    }

    public List<ProjectModel> getAllProjects() {
        return projectRepository.findAllProjects();
    }

    public Optional<ProjectModel> getProjectById(Integer id) {
        return projectRepository.findById(id);
    }

    public ProjectModel createProject(ProjectModel project) {
        projectRepository.insertProject(project);
        // Note: Our SP doesn't return the newly created ID, but in a real-world scenario we'd use LAST_INSERT_ID()
        return project;
    }

    public ProjectModel updateProject(Integer id, ProjectModel projectDetails) {
        projectDetails.setId(id);
        projectRepository.updateProject(projectDetails);
        return projectDetails;
    }

    public void deleteProject(Integer id) {
        projectRepository.deleteProject(id);
    }

    // --- LOGIC MONGODB ---
    public List<CommentModel> getCommentsForProject(Integer projectId) {
        return commentRepository.findByProjectId(projectId);
    }

    public CommentModel addComment(Integer projectId, String userId, CommentModel comment) {
        comment.setProjectId(projectId);
        comment.setUserId(userId);
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }
}
