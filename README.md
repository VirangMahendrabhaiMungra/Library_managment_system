# Smart Library Management System (SLMS)

## Overview
An Enterprise-Grade Library Management System built with Java 21, Spring Boot 3, ReactJS, and MySQL 8. The project follows Clean Architecture, SOLID Principles, and is containerized via Docker for easy deployment.

## Features
* Role-based access control (Admin, Librarian, Student)
* Book inventory, reservation, and issue tracking
* Automated fine calculation
* JWT Authentication
* Comprehensive reporting & analytics dashboards
* Responsive dark-mode compatible UI

## Technology Stack
- **Backend:** Java 21, Spring Boot 3, Spring Security, Hibernate
- **Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit
- **Database:** MySQL 8
- **DevOps:** Docker, Docker Compose

## Getting Started (Local Development)

### Prerequisites
- JDK 21
- Node.js v18+
- MySQL 8 or Docker

### 1. Database Setup
The database schema can be found in `database/schema.sql`.
If using Docker, simply run:
```bash
docker-compose up -d db
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*API Documentation available at: http://localhost:8080/swagger-ui.html*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*App available at: http://localhost:5173*

## Deployment (Production)
To deploy the full stack via Docker:
```bash
docker-compose up --build -d
```
Frontend will be served at `http://localhost:3000`
Backend APIs at `http://localhost:8080`
