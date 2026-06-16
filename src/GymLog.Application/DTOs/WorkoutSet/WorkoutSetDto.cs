namespace GymLog.Application.DTOs.WorkoutSet;

public record WorkoutSetDto
{
    public int Id { get; init; }
    public int WorkoutExerciseId { get; init; }
    public int SetNumber { get; init; }
    public int Reps { get; init; }
    public decimal? WeightKg { get; init; }
    public string? Notes { get; init; }
}