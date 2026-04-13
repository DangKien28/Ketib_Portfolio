package com.portfolio.java_project.repositories;

import com.portfolio.java_project.models.ProjectModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ProjectRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProjectRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Tự động map kết quả thủ công (chuẩn JDBC, từ chối JPA)
    private RowMapper<ProjectModel> projectRowMapper = new RowMapper<ProjectModel>() {
        @Override
        public ProjectModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            ProjectModel project = new ProjectModel();
            project.setId(rs.getInt("id"));
            project.setTitle(rs.getString("title"));
            project.setDescription(rs.getString("description"));
            project.setTechStack(rs.getString("tech_stack"));
            project.setGithubUrl(rs.getString("github_url"));
            project.setLiveUrl(rs.getString("live_url"));
            
            Timestamp ts = rs.getTimestamp("created_at");
            if (ts != null) {
                project.setCreatedAt(ts.toLocalDateTime());
            }
            return project;
        }
    };

    public List<ProjectModel> findAllProjects() {
        return jdbcTemplate.query("CALL SP_GetAllProjects()", projectRowMapper);
    }

    public Optional<ProjectModel> findById(Integer id) {
        String sql = "SELECT * FROM projects WHERE id = ?";
        List<ProjectModel> projects = jdbcTemplate.query(sql, projectRowMapper, id);
        return projects.stream().findFirst();
    }

    public int insertProject(ProjectModel project) {
        String call_sp = "CALL SP_InsertProject(?, ?, ?, ?, ?)";
        return jdbcTemplate.update(call_sp,
                project.getTitle(),
                project.getDescription(),
                project.getTechStack(),
                project.getGithubUrl(),
                project.getLiveUrl()
        );
    }

    public int updateProject(ProjectModel project) {
        String call_sp = "CALL SP_UpdateProject(?, ?, ?, ?)";
        return jdbcTemplate.update(call_sp,
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getTechStack()
        );
    }

    public int deleteProject(Integer id) {
        String sql = "DELETE FROM projects WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
