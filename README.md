# GymLog API

> A REST API for tracking strength training workouts, built with .NET 9.

GymLog API is built to practice modern .NET development. It's a REST API for managing gym exercises and workout sessions, with a lightweight HTML/Tailwind frontend for full CRUD on exercises. I built it to explore Clean Architecture, dependency injection, FluentValidation, and centralized error handling with custom exceptions and middleware.

## Tech Stack

- **.NET 9** - main framework
- **ASP.NET Core** - REST API framework
- **Entity Framework Core 9** - ORM
- **Microsoft SQL Server** - database (via Docker)
- **FluentValidation 12** - input validation
- **Swagger / OpenAPI** - API documentation
- **Tailwind CSS v4** - frontend styling (browser build, no bundler)
- **Vanilla JS frontend** - static HTML UI served from `wwwroot`
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

### Web UI

A static frontend is served from `wwwroot` and available at the application root:

- **`http://localhost:8080/`** - exercise catalog with create, edit, and delete

It's a single `index.html` page styled with Tailwind CSS v4 (loaded via browser CDN) and vanilla JavaScript that talks to the same `/api/exercises` endpoints described below. No separate build step is required.

### API Endpoints

#### Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | Get all exercises |
| GET | `/api/exercises/{id}` | Get exercise by ID |
| POST | `/api/exercises` | Create new exercise |
| PUT | `/api/exercises/{id}` | Update exercise |
| DELETE | `/api/exercises/{id}` | Delete exercise |

#### Workouts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/{id}` | Get workout by ID |
| POST | `/api/workouts` | Create new workout |
| PUT | `/api/workouts/{id}` | Update workout |
| DELETE | `/api/workouts/{id}` | Delete workout |

## Recent Updates

- Added `Workout` as a domain entity for training sessions.
- Added full CRUD API support for workouts.
- Added workout DTOs, mappings, application service, controller, and FluentValidation validators.
- Added missing create validator for exercises so the API can start correctly with dependency injection validation enabled.

## Future Features

The next development steps will focus on connecting workouts with exercises, tracking performed sets, and expanding the frontend beyond the exercise catalog.

### 1. Database Migration for Workouts

Add and apply an EF Core migration for the `Workouts` table so the database schema matches the new workout API code.

Planned command:

```bash
dotnet ef migrations add AddWorkouts --project src/GymLog.Infrastructure --startup-project src/GymLog.API
dotnet ef database update --project src/GymLog.Infrastructure --startup-project src/GymLog.API
```

### 2. Exercises in Workouts

Connect workouts with existing exercises, so one workout can contain multiple exercises.

Planned endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workouts/{workoutId}/exercises` | Add exercise to workout |
| DELETE | `/api/workouts/{workoutId}/exercises/{workoutExerciseId}` | Remove exercise from workout |

Initial model idea:

- `Id`
- `WorkoutId`
- `ExerciseId`
- `Order`

### 3. Workout Sets

Track performed sets for each exercise inside a workout.

Planned endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets` | Add set to workout exercise |
| PUT | `/api/sets/{id}` | Update set |
| DELETE | `/api/sets/{id}` | Delete set |

Initial model idea:

- `Id`
- `WorkoutExerciseId`
- `SetNumber`
- `Reps`
- `WeightKg`
- `Notes`

### 4. Workout Frontend

Extend the static frontend from exercise management to workout tracking.

Planned UI features:

- List workouts by date.
- Create and edit workout notes.
- Add exercises to a workout.
- Track sets, reps, and weight.

### 5. Tests and Quality

- Add integration tests for exercise and workout endpoints.
- Add validation tests for DTO validators.
- Add API smoke tests for Docker Compose startup.

## Status

Work in progress. Exercise CRUD and workout CRUD are implemented in the API. The current frontend supports exercise management; workout tracking UI and exercise/set tracking are planned next.
