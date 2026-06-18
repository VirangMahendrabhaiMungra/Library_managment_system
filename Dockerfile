# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/pom.xml
RUN cd backend && mvn dependency:go-offline -B
COPY backend/src ./backend/src
RUN cd backend && mvn clean package -DskipTests -B

# ---- Frontend Build Stage ----
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Production Stage ----
FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app

# Copy the Spring Boot JAR
COPY --from=build /app/backend/target/*.jar app.jar

# Copy the frontend build output to be served by a reverse proxy
COPY --from=frontend-build /app/dist /app/frontend-dist

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
