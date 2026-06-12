namespace GymLog.Application.DTOs.WorkoutExercise;

public record WorkoutExerciseDto
{
    public int Id { get; init; }
    public int WorkoutId { get; init; }
    public int ExerciseId { get; init; }
    public string ExerciseName { get; init; } = string.Empty;
    public int Order { get; init; }
}
