using GymLog.Application.DTOs.Workouts;
using GymLog.Application.DTOs.WorkoutExercise;
using GymLog.Application.DTOs.WorkoutSet;

namespace GymLog.Application.Services.Workouts;

public interface IWorkoutService
{
    Task<IEnumerable<WorkoutDto>> GetAllAsync();
    Task<WorkoutDto> GetByIdAsync(int id);
    Task<WorkoutDto> CreateAsync(CreateWorkoutDto dto);
    Task UpdateAsync(int id, UpdateWorkoutDto dto);
    Task DeleteAsync(int id);
    Task<WorkoutExerciseDto> AddExerciseAsync(int workoutId, AddWorkoutExerciseDto dto);
    Task<IEnumerable<WorkoutExerciseDto>> GetExercisesAsync(int workoutId);
    Task RemoveExerciseAsync(int workoutId, int workoutExerciseId);
    Task<WorkoutSetDto> AddSetAsync(int workoutId, int workoutExerciseId, AddWorkoutSetDto dto);
}