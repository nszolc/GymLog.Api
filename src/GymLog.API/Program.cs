using GymLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using GymLog.Application.Validators.Exercises;
using GymLog.API.Middleware;
using GymLog.Application.Services.Exercises;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddValidatorsFromAssemblyContaining<CreateExerciseDtoValidator>();
builder.Services.AddScoped<IExerciseService, ExerciseService>();  // ← NOWE

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
app.UseAuthorization();
app.MapControllers();

app.Run();
