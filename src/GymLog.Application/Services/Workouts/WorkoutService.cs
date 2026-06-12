using FluentValidation;
using GymLog.Application.DTOs.Workouts;
using GymLog.Application.DTOs.WorkoutExercise;
using GymLog.Application.Mappings;
using GymLog.Domain.Entities;
using GymLog.Domain.Exceptions;
using GymLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using ValidationException = GymLog.Domain.Exceptions.ValidationException;


namespace GymLog.Application.Services.Workouts;

public class WorkoutService : IWorkoutService
{
    private readonly GymLogDbContext _db;
    private readonly IValidator<CreateWorkoutDto> _createValidator;
    private readonly IValidator<UpdateWorkoutDto> _updateValidator;
    
    public WorkoutService(
        GymLogDbContext db,
        IValidator<CreateWorkoutDto> createValidator,
        IValidator<UpdateWorkoutDto> updateValidator)  
    {
        _db = db;
        _createValidator = createValidator;
        _updateValidator = updateValidator;  
    }
    
    public async Task<IEnumerable<WorkoutDto>> GetAllAsync()
    {
        var result = await _db.Workouts.AsNoTracking().ToListAsync();
        return result.Select(e => e.ToDto());
    }

    public async Task<WorkoutDto> GetByIdAsync(int id)
    {
        var result = await _db.Workouts.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        if (result == null) throw new NotFoundException($"Workout with id {id} not found");
        return result.ToDto();
    }

    public async Task<WorkoutDto> CreateAsync(CreateWorkoutDto dto)
    {
        var result = await _createValidator.ValidateAsync(dto);
        if (!result.IsValid)
        {
            // Poprawka: grupujemy oryginalne bledy walidacji, bo string nie ma PropertyName.
            var errors = result.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray()
                );
            throw new ValidationException(errors);
        }
        // mapowanie na entity
       var workout =  dto.ToEntity();
        
        _db.Workouts.Add(workout);
        await _db.SaveChangesAsync();
       // mapowanie na dto (znowu)
        return workout.ToDto();
    }

    public async Task UpdateAsync(int id, UpdateWorkoutDto dto)
    {
        var result = await _updateValidator.ValidateAsync(dto);

        if (!result.IsValid)
        {
            // Poprawka: uzywamy wyniku walidacji z tej metody, czyli zmiennej result.
            var errors = result.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray()
                );
        
            throw new ValidationException(errors);
        }
        
        var workout = await _db.Workouts.FirstOrDefaultAsync(e => e.Id == id);
        if (workout == null) throw new NotFoundException($"Workout with id {id} not found");
        
        dto.UpdateEntity(workout);
        await _db.SaveChangesAsync();
       
    }

    public async Task DeleteAsync(int id)
    {
        var workout = await _db.Workouts.FirstOrDefaultAsync(e => e.Id == id);
        if (workout == null) throw new NotFoundException($"Workout with id {id} not found");
        _db.Workouts.Remove(workout);
        await _db.SaveChangesAsync();
    }

    public async Task<WorkoutExerciseDto> AddExerciseAsync(int workoutId, AddWorkoutExerciseDto dto)
    {
        var workoutExists = await _db.Workouts.AnyAsync(e => e.Id == workoutId);
        if (!workoutExists) throw new NotFoundException($"Workout with id {workoutId} not found");

        var exercise = await _db.Exercises.FirstOrDefaultAsync(e => e.Id == dto.ExerciseId);
        if (exercise == null) throw new NotFoundException($"Exercise with id {dto.ExerciseId} not found");

        var alreadyAdded = await _db.WorkoutExercises
            .AnyAsync(e => e.WorkoutId == workoutId && e.ExerciseId == dto.ExerciseId);
        if (alreadyAdded)
        {
            throw new ConflictException($"Exercise with id {dto.ExerciseId} is already added to workout {workoutId}");
        }

        var lastOrder = await _db.WorkoutExercises
            .Where(e => e.WorkoutId == workoutId)
            .MaxAsync(e => (int?)e.Order) ?? 0;

        var workoutExercise = new WorkoutExercise
        {
            WorkoutId = workoutId,
            ExerciseId = dto.ExerciseId,
            Order = lastOrder + 1
        };

        _db.WorkoutExercises.Add(workoutExercise);
        await _db.SaveChangesAsync();

        return new WorkoutExerciseDto
        {
            Id = workoutExercise.Id,
            WorkoutId = workoutExercise.WorkoutId,
            ExerciseId = workoutExercise.ExerciseId,
            ExerciseName = exercise.Name,
            Order = workoutExercise.Order
        };
    }
    
}
