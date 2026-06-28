using GymLog.Application.DTOs.Workouts;
using FluentValidation;
namespace GymLog.Application.Validators.Workouts;

public class CreateWorkoutDtoValidator : AbstractValidator<CreateWorkoutDto>
{
    public CreateWorkoutDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(2, 100);
        RuleFor(x => x.Date).NotEmpty();
        RuleFor(x => x.Notes).MaximumLength(500);
    }
    
}
