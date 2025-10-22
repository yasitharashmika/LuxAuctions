using LuxAuction.Data;
using LuxAuction.Models;
using LuxAuction.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LuxAuction.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        // This is how we get the database connection
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            // Checks if any user in the Users table has this email
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            // Adds the user and saves the changes
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            // Find the first user with this email (or null if not found)
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}