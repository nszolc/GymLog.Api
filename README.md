# GymLog

> A REST API and lightweight web UI for tracking strength training workouts, built with .NET 9.

GymLog is a practice project for modern .NET development. It provides a REST API for managing gym exercises, workout sessions, workout exercises, and performed sets. The API is paired with a static HTML/Tailwind/vanilla JavaScript frontend served directly from `wwwroot`.

The project explores Clean Architecture, dependency injection, Entity Framework Core, FluentValidation, centralized error handling, and Docker-based local development.

## Tech Stack

- **.NET 9** - main framework
- **ASP.NET Core** - REST API framework
- **Entity Framework Core 9** - ORM
- **Microsoft SQL Server** - database
- **FluentValidation 12** - input validation
- **Swagger / OpenAPI** - API documentation
- **Tailwind CSS v4** - frontend styling through the browser build
- **Vanilla JavaScript** - static frontend served from `wwwroot`
- **Docker + Docker Compose** - local containerized setup
- **Clean Architecture** - layered architecture pattern

## Architecture

The solution is split into four layers. Dependencies flow inward: outer layers depend on inner layers, not the other way around.

- **GymLog.Domain** - business entities, enums, and custom exceptions.
- **GymLog.Application** - DTOs, validators, mappings, and application services.
- **GymLog.Infrastructure** - Entity Framework Core database context and migrations.
- **GymLog.API** - controllers, middleware, dependency injection, Swagger, and static frontend hosting.

Error handling is centralized in `ExceptionHandlingMiddleware`, which catches domain exceptions and returns API errors as Problem Details responses.

## Features

- Manage exercises: create, edit, delete, list, and search.
- Manage workouts with names, dates, and notes.
- Add exercises to workouts.
- Add sets to workout exercises with reps, weight, set number, and notes.
- Prevent deleting exercises that are already used in workouts.
- Use a static frontend for the main exercise and workout flows.
- Run the full app with SQL Server through Docker Compose.

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run with Docker

```bash
docker compose up -d --build
```

The application will be available at:

- **Web UI:** `http://localhost:8080/`
- **Swagger:** `http://localhost:8080/swagger`

Docker Compose starts:

- `gymlog-db` - SQL Server exposed on host port `1434`
- `gymlog-api` - ASP.NET Core API exposed on host port `8080`

The API container applies EF Core migrations automatically on startup when `Database__ApplyMigrations=true` is set in `docker-compose.yml`.

### Run Locally

Start SQL Server locally or through Docker, then apply migrations:

```bash
dotnet ef database update --project src/GymLog.Infrastructure --startup-project src/GymLog.API
```

Run the API:

```bash
dotnet run --project src/GymLog.API
```

The local development profile uses:

- **Web UI:** `http://localhost:5050/`
- **Swagger:** `http://localhost:5050/swagger`

The default local connection string points to:

```text
Server=localhost\SQLEXPRESS;Database=GymLogDb;Trusted_Connection=True;TrustServerCertificate=True
```

## Web UI

The frontend is a single static page served from `src/GymLog.API/wwwroot`.

It supports:

- exercise list, search, create, edit, and delete
- workout list, search, create, and edit
- adding exercises to a workout
- adding and removing sets inside a workout

There is no separate frontend build step.

## API Endpoints

### Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | Get all exercises |
| GET | `/api/exercises/{id}` | Get exercise by ID |
| POST | `/api/exercises` | Create exercise |
| PUT | `/api/exercises/{id}` | Update exercise |
| DELETE | `/api/exercises/{id}` | Delete exercise |

### Workouts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/{id}` | Get workout by ID |
| POST | `/api/workouts` | Create workout |
| PUT | `/api/workouts/{id}` | Update workout |
| DELETE | `/api/workouts/{id}` | Delete workout |

### Workout Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts/{workoutId}/exercises` | Get exercises assigned to a workout |
| POST | `/api/workouts/{workoutId}/exercises` | Add exercise to a workout |
| DELETE | `/api/workouts/{workoutId}/exercises/{workoutExerciseId}` | Remove exercise from a workout |

### Workout Sets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets` | Get sets for a workout exercise |
| POST | `/api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets` | Add set to a workout exercise |
| DELETE | `/api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets/{setId}` | Remove set from a workout exercise |

## Useful Commands

Create a migration:

```bash
dotnet ef migrations add MigrationName --project src/GymLog.Infrastructure --startup-project src/GymLog.API
```

Apply migrations:

```bash
dotnet ef database update --project src/GymLog.Infrastructure --startup-project src/GymLog.API
```

Build the solution:

```bash
dotnet build GymLog.sln
```

Start Docker containers:

```bash
docker compose up -d --build
```

Stop Docker containers:

```bash
docker compose down
```

## Status

Work in progress. Exercise management, workout management, workout exercises, workout sets, Docker Compose startup, and the basic web UI are implemented.

Next likely improvements:

- editing existing workout sets
- integration tests for API endpoints
- seed data for local development
- stronger frontend validation and loading states
