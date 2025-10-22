using LuxAuction.Models;
using Microsoft.EntityFrameworkCore;

namespace LuxAuction.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<AuctionItem> AuctionItems { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // This configures the relationships and data types in the database
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure the User -> AuctionItem relationship
            builder.Entity<AuctionItem>()
                .HasOne(item => item.Seller) // An AuctionItem has one Seller (User)
                .WithMany(user => user.AuctionItems) // A User can have many AuctionItems
                .HasForeignKey(item => item.SellerId) // The link is via the SellerId
                .OnDelete(DeleteBehavior.Restrict); // Don't delete a user if they have listings

            // --- ADDED THIS BLOCK to specify decimal precision ---
            // This fixes the warnings you saw during migration
            builder.Entity<AuctionItem>(entity =>
            {
                // Configures prices to be stored as decimal(18, 2)
                // (e.g., 18 total digits, 2 after the decimal point)
                entity.Property(p => p.StartingBid)
                      .HasColumnType("decimal(18, 2)");

                entity.Property(p => p.ReservePrice)
                      .HasColumnType("decimal(18, 2)");

                // Configures weight to be stored as decimal(10, 2)
                // (e.g., 10 total digits, 2 after the decimal point)
                entity.Property(p => p.Weight)
                      .HasColumnType("decimal(10, 2)");
            });
            // ---------------------------------------------------
        }
    }
}