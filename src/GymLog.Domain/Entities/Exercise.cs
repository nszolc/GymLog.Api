using GymLog.Domain.Enums;

namespace GymLog.Domain.Entities;

public class Exercise
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public MuscleGroup MuscleGroup { get; set; }
    public ExerciseType ExerciseType { get; set; }
    public bool IsCustom { get; set; }
    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}
