namespace GymLog.Application.DTOs.Workouts;

public record CreateWorkoutDto
{
    public string Name { get; init; } = string.Empty;
    public DateTime Date { get; init; }
    public string? Notes { get; init; }
}
