using LuxAuction.Models;
using LuxAuction.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace LuxAuction.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}