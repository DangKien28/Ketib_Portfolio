package com.portfolio.java_project.controllers;

import com.portfolio.java_project.models.CommentModel;
import com.portfolio.java_project.models.ProjectModel;
import com.portfolio.java_project.services.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // 1. Quản lý Project (Lưu ở MySQL)
    @GetMapping
    public List<ProjectModel> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectModel> getProjectById(@PathVariable Integer id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProjectModel> createProject(@RequestBody ProjectModel projectModel, @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build(); // Security check (Header from Node Gateway proxy)
        }
        return ResponseEntity.ok(projectService.createProject(projectModel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectModel> updateProject(@PathVariable Integer id, @RequestBody ProjectModel projectModel, @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(projectService.updateProject(id, projectModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id, @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // 2. Quản lý Bình luận (Lưu ở MongoDB)
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentModel>> getComments(@PathVariable Integer id) {
        return ResponseEntity.ok(projectService.getCommentsForProject(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentModel> addComment(
            @PathVariable Integer id, 
            @RequestBody CommentModel comment, 
            @RequestHeader("X-User-Id") String userId) {
        
        CommentModel savedComment = projectService.addComment(id, userId, comment);
        return ResponseEntity.ok(savedComment);
    }
}
