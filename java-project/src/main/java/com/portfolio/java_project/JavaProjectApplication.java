package com.portfolio.java_project;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.nio.file.Paths;
import java.nio.file.Files;

@SpringBootApplication
public class JavaProjectApplication {

	public static void main(String[] args) {
		// Nạp .env từ project root chung của portfolio
		String rootDir = Paths.get("..").toAbsolutePath().normalize().toString();
		if (Files.exists(Paths.get(rootDir, ".env"))) {
			Dotenv dotenv = Dotenv.configure()
					.directory(rootDir)
					.filename(".env")
					.ignoreIfMissing()
					.load();
			
			// Đẩy các biến lên System properties để Spring Boot có thể tự động inject vào application.properties
			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});
		}
		
		SpringApplication.run(JavaProjectApplication.class, args);
	}

}
