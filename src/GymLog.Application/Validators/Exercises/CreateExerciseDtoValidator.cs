using FluentValidation;
using GymLog.Application.DTOs.Exercises;

namespace GymLog.Application.Validators.Exercises;

public class CreateExerciseDtoValidator : AbstractValidator<CreateExerciseDto>
{
    public CreateExerciseDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(2, 100);

        RuleFor(x => x.Description).MaximumLength(500);

        RuleFor(x => x.MuscleGroup).IsInEnum();

        RuleFor(x => x.ExerciseType).IsInEnum();
    }
}
