namespace GymLog.Application.DTOs.Workouts;

public record UpdateWorkoutDto
{
    public DateTime Date { get; init; }
    public string? Notes { get; init; }
}