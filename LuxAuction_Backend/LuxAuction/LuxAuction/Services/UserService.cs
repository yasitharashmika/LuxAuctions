using LuxAuction.Dtos;
using LuxAuction.Models;
using LuxAuction.Repositories;
using Microsoft.Extensions.Configuration; // For IConfiguration
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LuxAuction.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration; // To read appsettings.json

        // Inject IConfiguration to get JWT settings
        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<(bool Success, string ErrorMessage)> RegisterUserAsync(RegisterDto dto)
        {
            // 1. Check if user already exists
            if (await _userRepository.UserExistsAsync(dto.Email))
            {
                return (false, "An account with this email already exists.");
            }

            // 2. Hash the password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 3. Create a new User model
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Role = dto.Role,
                PasswordHash = passwordHash
            };

            // 4. Add the user
            await _userRepository.AddUserAsync(user);

            // 5. Return success
            return (true, null);
        }

        public async Task<(bool Success, string TokenOrError)> LoginUserAsync(LoginDto dto)
        {
            // 1. Find user by email
            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

            // 2. Check if user exists and password is correct
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                // Use a generic error message for security
                return (false, "Invalid email or password.");
            }

            // 3. Generate JWT Token
            string token = GenerateJwtToken(user);

            // 4. Return success with the token
            return (true, token);
        }

        private string GenerateJwtToken(User user)
        {
            // Get the secret key from appsettings.json
            var jwtKey = _configuration["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create claims (payload)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role) // Add the user's role
            };

            // Create the token
            var token = new JwtSecurityToken(
                // issuer: _configuration["Jwt:Issuer"], // Optional
                // audience: _configuration["Jwt:Audience"], // Optional
                claims: claims,
                expires: DateTime.Now.AddDays(1), // Token is valid for 1 day
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}