package com.portfolio.java_project.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
public class CommentModel {
    
    @Id
    private String id;
    
    private Integer projectId; // Liên kết id nguyên thủy bên MySQL
    private String userId; // User UUID từ hệ thống Node
    private String content;
    private Integer ratingStart;
    private LocalDateTime createdAt;

    // Constructors
    public CommentModel() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getRatingStart() { return ratingStart; }
    public void setRatingStart(Integer ratingStart) { this.ratingStart = ratingStart; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
