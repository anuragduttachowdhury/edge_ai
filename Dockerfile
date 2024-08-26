FROM maven:3.9.6-amazoncorretto-17 as builder
WORKDIR /backend
COPY src src
COPY pom.xml pom.xml
RUN mvn clean install -DskipTests
 
# Runtime Stage
FROM maven:3.9.6-amazoncorretto-17 as final 
ENV TZ="Asia/Kolkata"
WORKDIR /binary 
COPY --from=builder /backend/target/edge_ai-*.jar .
 
CMD ["java", "-jar", "edge_ai-1.0.jar"]
 
EXPOSE 8080

