namespace GymLog.Domain.Entities;

public class WorkoutExercise
{
    //klasa posrednia - cwiczenie w danym treningu 
    public int Id { get; set; }

    public int WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!;

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public int Order { get; set; } //kolejnosc cwiczenia
}   
   