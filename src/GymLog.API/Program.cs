using GymLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using GymLog.Application.Validators.Exercises;
using GymLog.API.Middleware;
using GymLog.Application.Services.Exercises;
using GymLog.Application.Services.Workouts;
using GymLog.Application.Validators.Workouts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddValidatorsFromAssemblyContaining<UpdateExerciseDtoValidator>(); //walidatory
builder.Services.AddValidatorsFromAssemblyContaining<CreateWorkoutDtoValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateWorkoutDtoValidator>();

builder.Services.AddScoped<IExerciseService, ExerciseService>();  // serwisy
builder.Services.AddScoped<IWorkoutService, WorkoutService>();

builder.Services.AddDbContext<GymLogDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// index.html jako strona domyślna
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

app.Run();
