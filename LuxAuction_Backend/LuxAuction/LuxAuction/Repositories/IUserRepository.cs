using LuxAuction.Models;

namespace LuxAuction.Repositories
{
    public interface IUserRepository
    {
        // Checks if an email is already in the database
        Task<bool> UserExistsAsync(string email);

        // Adds a new user to the database
        Task AddUserAsync(User user);

        // Gets a user by their email
        Task<User> GetUserByEmailAsync(string email);
    }
}