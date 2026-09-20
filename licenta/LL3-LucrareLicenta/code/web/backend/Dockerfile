# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN mkdir -p /var/log/bank-app && chmod 777 /var/log/bank-app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
VOLUME ["/var/log/bank-app"]
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
