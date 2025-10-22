using LuxAuction.Data;
using LuxAuction.Models;
using Microsoft.EntityFrameworkCore;

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
    }
}