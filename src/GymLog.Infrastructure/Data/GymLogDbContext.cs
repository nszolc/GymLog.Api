using Microsoft.EntityFrameworkCore;
using GymLog.Domain.Entities;


namespace GymLog.Infrastructure.Data;

public class GymLogDbContext : DbContext
{
    public GymLogDbContext(DbContextOptions<GymLogDbContext> options) : base(options) { }

    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WorkoutExercise>(WorkoutExercise =>
        {
            WorkoutExercise.HasOne(x => x.Workout)
                .WithMany(x => x.WorkoutExercises)
                .HasForeignKey(x => x.WorkoutId);
            
            WorkoutExercise.HasOne(x => x.Exercise)
                .WithMany(x => x.WorkoutExercises)
                .HasForeignKey(x => x.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
