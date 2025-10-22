using LuxAuction.Data;
using LuxAuction.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq; // Add this using directive

namespace LuxAuction.Repositories.Implementations
{
    public class ListingRepository : IListingRepository
    {
        private readonly ApplicationDbContext _context;

        public ListingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddListingAsync(AuctionItem item)
        {
            await _context.AuctionItems.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<AuctionItem>> GetListingsBySellerIdAsync(int sellerId)
        {
            return await _context.AuctionItems
                .Where(item => item.SellerId == sellerId)
                .OrderByDescending(item => item.StartTime)
                .ToListAsync();
        }

        // --- ADD THESE METHODS ---
        public async Task<AuctionItem?> GetListingByIdAsync(int id)
        {
            // Find the item by its primary key
            return await _context.AuctionItems.FindAsync(id);
        }

        public async Task<bool> DeleteListingAsync(int id, int sellerId)
        {
            // Find the item ensuring it belongs to the correct seller
            var itemToDelete = await _context.AuctionItems
                                     .FirstOrDefaultAsync(item => item.Id == id && item.SellerId == sellerId);

            if (itemToDelete == null)
            {
                // Item not found or doesn't belong to this seller
                return false;
            }

            // Remove the item from the context
            _context.AuctionItems.Remove(itemToDelete);

            // Save changes to the database
            int changes = await _context.SaveChangesAsync();

            // Return true if at least one row was affected (should be 1)
            return changes > 0;
        }
        // -----------------------
    }
}