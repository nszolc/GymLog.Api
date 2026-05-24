# GymLog API

> A REST API for tracking strength training workouts, built with .NET 9.

GymLog API is built to practice modern .NET development. It's a REST API for managing gym exercises (workouts coming later). I built it to explore Clean Architecture, dependency injection, FluentValidation, and centralized error handling with custom exceptions and middleware.

## Tech Stack

- **.NET 9** - main framework
- **ASP.NET Core** - REST API framework
- **Entity Framework Core 9** - ORM
- **Microsoft SQL Server** - database (via Docker)
- **FluentValidation 12** - input validation
- **Swagger / OpenAPI** - API documentation
- **Docker + Docker Compose** - containerization
- **Clean Architecture** - layered architecture pattern

## Architecture

The project follows Clean Architecture principles, separating concerns into four layers. Dependencies flow inward - outer layers depend on inner ones, never the opposite.

- **GymLog.Domain** - core business entities, enums, and custom exceptions. No external dependencies.
- **GymLog.Application** - business logic, DTOs, validators, mappers, and application services.
- **GymLog.Infrastructure** - data access layer with Entity Framework Core and database context.
- **GymLog.API** - HTTP layer with controllers, middleware, and dependency injection setup.

Error handling is centralized in a custom `ExceptionHandlingMiddleware` that catches domain exceptions and returns responses in [RFC 7807 Problem Details](https://datatracker.ietf.org/doc/html/rfc7807) format.

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run with Docker

```bash
git clone https://github.com/nszolc/GymLog.Api.git
cd GymLog.Api
docker compose up -d --build
```

The API will be available at `http://localhost:8080/swagger`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | Get all exercises |
| GET | `/api/exercises/{id}` | Get exercise by ID |
| POST | `/api/exercises` | Create new exercise |
| PUT | `/api/exercises/{id}` | Update exercise |
| DELETE | `/api/exercises/{id}` | Delete exercise |

## Status

🚧 Work in progress - this is a learning project, more features coming soon.
