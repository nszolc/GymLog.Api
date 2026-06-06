namespace GymLog.Application.DTOs.Workouts;

public record CreateWorkoutDto
{
    public DateTime Date { get; init; }
    public string? Notes { get; init; }
}