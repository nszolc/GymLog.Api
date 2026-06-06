using Microsoft.EntityFrameworkCore;
using GymLog.Domain.Entities;

namespace GymLog.Infrastructure.Data;

public class GymLogDbContext : DbContext
{
    public GymLogDbContext(DbContextOptions<GymLogDbContext> options) : base(options) { }

    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Workout> Workouts => Set<Workout>();
}