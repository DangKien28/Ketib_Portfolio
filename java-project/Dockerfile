# Stage 1: Build source
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies
RUN mvn dependency:go-offline
COPY src ./src
# Build ignoring tests for speed
RUN mvn clean package -DskipTests

# Stage 2: Run container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Lấy file jar từ stage 1
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
