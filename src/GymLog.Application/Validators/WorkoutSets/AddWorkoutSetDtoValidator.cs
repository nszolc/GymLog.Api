using GymLog.Application.DTOs.WorkoutSet;
using FluentValidation;

namespace GymLog.Application.Validators.WorkoutSets;

public class AddWorkoutSetDtoValidator : AbstractValidator<AddWorkoutSetDto>
{
    public AddWorkoutSetDtoValidator()
    {
        RuleFor(x => x.Reps).GreaterThan(0);
        RuleFor(x=> x.WeightKg).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Notes).MaximumLength(500);
    }
}