namespace GymLog.Application.DTOs.Workouts;

public record WorkoutDto
{
    public int Id {get; init; }
    public string Name { get; init; } = string.Empty;
    public DateTime Date { get; init; }
    public string? Notes { get; init; }
}