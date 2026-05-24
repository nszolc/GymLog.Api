using FluentValidation;
using GymLog.Application.DTOs.Exercises;
using GymLog.Application.Mappings;
using GymLog.Domain.Exceptions;
using GymLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using ValidationException = GymLog.Domain.Exceptions.ValidationException;


namespace GymLog.Application.Services.Exercises;

public class ExerciseService: IExerciseService
{
    private readonly GymLogDbContext _db;
    private readonly IValidator<CreateExerciseDto> _createValidator;
    private readonly IValidator<UpdateExerciseDto> _updateValidator;

    public ExerciseService(
        GymLogDbContext db,
        IValidator<CreateExerciseDto> createValidator,
        IValidator<UpdateExerciseDto> updateValidator)  // ← NOWE
    {
        _db = db;
        _createValidator = createValidator;
        _updateValidator = updateValidator;  // ← NOWE
    }
    
    public async Task<IEnumerable<ExerciseDto>> GetAllAsync()
    {
        var exercises = await _db.Exercises
            .AsNoTracking()
            .ToListAsync();

        return exercises.Select(e => e.ToDto());
    }

    public async Task<ExerciseDto> GetByIdAsync(int id)
    {
        var exercise = await _db.Exercises
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise is null)
            throw new NotFoundException($"Exercise with id '{id}' was not found.");

        return exercise.ToDto();
    }
    
    public async Task<ExerciseDto> CreateAsync(CreateExerciseDto dto)
    {
        // 1. Walidacja
        var validationResult = await _createValidator.ValidateAsync(dto);
    
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray()
                );
        
            throw new ValidationException(errors);
        }

        // 2. Mapowanie DTO → Entity
        var exercise = dto.ToEntity();
    
        // 3. Zapis do bazy
        _db.Exercises.Add(exercise);
        await _db.SaveChangesAsync();
    
        // 4. Mapowanie Entity → DTO i zwrot
        return exercise.ToDto();
    }
    public async Task UpdateAsync(int id, UpdateExerciseDto dto)
    {
        // 1. Walidacja
        var validationResult = await _updateValidator.ValidateAsync(dto);
    
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray()
                );
        
            throw new ValidationException(errors);
        }
    
        // 2. Znajdź encję
        var exercise = await _db.Exercises.FindAsync(id);
    
        if (exercise is null)
            throw new NotFoundException($"Exercise with id '{id}' was not found.");
    
        // 3. Aktualizuj pola
        dto.UpdateEntity(exercise);
    
        // 4. Zapisz
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var exercise = await _db.Exercises.FindAsync(id);
    
        if (exercise is null)
            throw new NotFoundException($"Exercise with id '{id}' was not found.");
    
        _db.Exercises.Remove(exercise);
        await _db.SaveChangesAsync();
    }
    
    
}
