namespace GymLog.Domain.Entities;

public class Workout
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
}