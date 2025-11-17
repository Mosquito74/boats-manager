# Boats Manager

A full-stack application for managing boats, built with Spring Boot and React.

## 🚀 Technology Stack

### Backend
- **Java 21** - Modern Java version for better performance and features
- **Spring Boot 3.5.7** - Robust backend framework with embedded Tomcat
- **Spring Security** - Authentication and authorization
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management and build tool

### Frontend
- **React 19** - Modern frontend library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast development server and build tool
- **Material-UI (MUI)** - UI component library for a polished look
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### Containerization
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container application management

## 🏃‍♂️ Getting Started

### Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- (Optional) Node.js 18+ and Java 21 for local development without Docker

### Running with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mosquito74/boats-manager.git
   cd boats_manager
   ```

2. **Build and start the application**
   ```bash
   docker-compose up --build
   ```
   This will:
   - Build the frontend and copy the static files to the backend
   - Build the Spring Boot application
   - Start the application on port 8080

3. **Access the application**
   - Frontend: http://localhost:8080
   - API Documentation: http://localhost:8080/v3/api-docs
   - Swagger UI: http://localhost:8080/swagger-ui.html (You can use the Bearer token after logging in the app and getting it from your browser in Local Storage if you wished to try out the endpoints)
   - You can use the user "test" with the password "test" to log in

## 🏗️ Project Structure

```
boats_manager/
├── backend/               # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/     # Java source code
│   │   │   └── resources/ # Configuration files and static resources
│   │   └── test/         # Test files
│   └── pom.xml           # Maven configuration
│
├── frontend/             # React application
│   ├── public/           # Static files
│   ├── src/              # React components and logic
│   ├── package.json      # NPM dependencies
│   └── vite.config.ts    # Vite configuration
│
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # This file
```

## 🛠️ Development Setup

### Backend Development

1. **Prerequisites**
   - Java 21 JDK
   - Maven 3.9+

2. **Running locally**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Development

1. **Prerequisites**
   - Node.js 18+

2. **Running locally**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at http://localhost:5173 with hot-reload enabled.

## 🌐 API Documentation

- **OpenAPI/Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs (JSON)**: http://localhost:8080/v3/api-docs

## IMPROVEMENTS

- Add E2E tests (Cypress)
- Add more Unit tests (both frontend and backend) and improve coverage / Snapshot testing
- Enhance UI to make it more User Friendly
- Add Searching / Filtering and Pagination
- Test accessibility
- Add More Error Handling - Update Global Exception Handler (Add more)
- Prevent Updating if there is no update
- Add logging
- Switch to not embedded Database (H2 -> PostgreSQL)
- Add CI/CD pipelines

---

Built by Nathan S.
