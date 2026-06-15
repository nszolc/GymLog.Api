using FluentValidation;
using GymLog.Application.DTOs.Workouts;

namespace GymLog.Application.Validators.Workouts;

public class UpdateWorkoutDtoValidator : AbstractValidator<UpdateWorkoutDto>
{
    public UpdateWorkoutDtoValidator()
    {
         RuleFor(x => x.Date).NotEmpty();
         RuleFor(x => x.Notes).MaximumLength(500);
    }
    
} 
