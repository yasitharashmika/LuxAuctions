using LuxAuction.Dtos;
using LuxAuction.Services;
using Microsoft.AspNetCore.Mvc;

namespace LuxAuction.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This makes the URL: /api/auth
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;

        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")] // POST: /api/auth/register
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var (success, errorMessage) = await _userService.RegisterUserAsync(dto);

            if (!success)
            {
                return BadRequest(errorMessage); // Sends 400 error
            }

            return Ok("User created successfully."); // Sends 200 OK
        }

        [HttpPost("login")] // POST: /api/auth/login
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var (success, tokenOrError) = await _userService.LoginUserAsync(dto);

            if (!success)
            {
                // Return 401 Unauthorized if login fails
                return Unauthorized(tokenOrError);
            }

            // Return 200 OK with the token in an object
            return Ok(new { token = tokenOrError });
        }
    }
}