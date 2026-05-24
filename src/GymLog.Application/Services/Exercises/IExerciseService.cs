using GymLog.Application.DTOs.Exercises;

namespace GymLog.Application.Services.Exercises;

public interface IExerciseService
{
    Task<IEnumerable<ExerciseDto>> GetAllAsync();
    Task<ExerciseDto> GetByIdAsync(int id);
    Task<ExerciseDto> CreateAsync(CreateExerciseDto dto);
    Task UpdateAsync(int id, UpdateExerciseDto dto);
    Task DeleteAsync(int id);
}