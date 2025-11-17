# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the POM file and download dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the application
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Set the entry point
ENTRYPOINT ["java", "-jar", "app.jar"]
