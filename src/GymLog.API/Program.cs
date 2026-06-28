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

if (app.Configuration.GetValue<bool>("Database:ApplyMigrations"))
{
    await ApplyMigrationsAsync(app);
}

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

static async Task ApplyMigrationsAsync(WebApplication app)
{
    const int maxAttempts = 10;
    
    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<GymLogDbContext>();
            
            await dbContext.Database.MigrateAsync();
            return;
        }
        catch (Exception ex) when (attempt < maxAttempts)
        {
            app.Logger.LogWarning(
                ex,
                "Database migration failed. Retrying in 5 seconds. Attempt {Attempt}/{MaxAttempts}",
                attempt,
                maxAttempts);
            
            await Task.Delay(TimeSpan.FromSeconds(5));
        }
    }
}
