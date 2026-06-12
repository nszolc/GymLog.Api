using Microsoft.AspNetCore.Mvc;
using GymLog.Application.DTOs.Workouts;
using GymLog.Application.DTOs.WorkoutExercise;
using GymLog.Application.Services.Workouts;

namespace GymLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _service;
    
    public WorkoutsController(IWorkoutService service)
    {
        _service = service;
    }
    //GET /api/workouts
    [HttpGet] 
    public async Task<ActionResult<IEnumerable<WorkoutDto>>> GetAll()
    {
        var workouts = await _service.GetAllAsync();
        return Ok(workouts);
    }
    //GET /api/workouts/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<WorkoutDto>> GetById (int id)
    {
        var workout = await _service.GetByIdAsync(id);
        return Ok(workout);
    }
    //Post /api/workouts
    [HttpPost]
    public async Task<ActionResult<WorkoutDto>> Create( [FromBody] CreateWorkoutDto dto)
    {
        var workout = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = workout.Id }, workout);
    }
    //PUT /api/workouts/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkoutDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }
    
    //DELETE /api/workouts/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    //POST /api/workouts/{workoutId}/exercises
    [HttpPost("{workoutId:int}/exercises")]
    public async Task<ActionResult<WorkoutExerciseDto>> AddExercise(
        int workoutId,
        [FromBody] AddWorkoutExerciseDto dto)
    {
        var workoutExercise = await _service.AddExerciseAsync(workoutId, dto);
        return CreatedAtAction(nameof(GetById), new { id = workoutId }, workoutExercise);
    }
}
