using GymLog.Application.DTOs.Workouts;
using GymLog.Domain.Entities;

namespace GymLog.Application.Mappings;

public static class WorkoutMappings
{
    public static WorkoutDto ToDto(this Workout workout)
    {
        return new WorkoutDto
        {
            Id = workout.Id,
            Date = workout.Date,
            Notes = workout.Notes
        };
    }

    public static Workout ToEntity(this CreateWorkoutDto dto)
    {
        return new Workout
        {
            Date = dto.Date,
            Notes = dto.Notes
        };
    }

    public static void UpdateEntity(this UpdateWorkoutDto dto, Workout workout)
    {
        workout.Date = dto.Date;
        workout.Notes = dto.Notes;
    }
}