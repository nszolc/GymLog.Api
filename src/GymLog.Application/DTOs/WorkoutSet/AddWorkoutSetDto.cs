namespace GymLog.Application.DTOs.WorkoutSet;

public record AddWorkoutSetDto
{
    public int Reps { get; init; }
    public decimal? WeightKg { get; init; }
    public string? Notes { get; init; }
}
