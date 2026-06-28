# Stage 1: BUILD
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/GymLog.API/GymLog.API.csproj", "src/GymLog.API/"]
COPY ["src/GymLog.Application/GymLog.Application.csproj", "src/GymLog.Application/"]
COPY ["src/GymLog.Domain/GymLog.Domain.csproj", "src/GymLog.Domain/"]
COPY ["src/GymLog.Infrastructure/GymLog.Infrastructure.csproj", "src/GymLog.Infrastructure/"]

RUN dotnet restore "src/GymLog.API/GymLog.API.csproj"

COPY . .

WORKDIR "/src/src/GymLog.API"
RUN dotnet publish "GymLog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: RUNTIME
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "GymLog.API.dll"]
