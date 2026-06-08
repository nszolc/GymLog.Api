using GymLog.Application.DTOs.Exercises;
using GymLog.Application.Services.Exercises;
using Microsoft.AspNetCore.Mvc;

namespace GymLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _service;

    public ExercisesController(IExerciseService service)
    {
        _service = service;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExerciseDto>>> GetAll()
    {
        var exercises = await _service.GetAllAsync();
        return Ok(exercises);
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExerciseDto>> GetById (int id)
    {
        var exercise = await _service.GetByIdAsync(id);
        return Ok(exercise);
    }
    
    [HttpPost]
    public async Task<ActionResult<ExerciseDto>> Create ([FromBody] CreateExerciseDto dto)
    {
        var created = await _service.CreateAsync(dto);
        
        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created
        );
    }

    // PUT /api/exercises/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update (int id, [FromBody] UpdateExerciseDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    // DELETE /api/exercises/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete (int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}