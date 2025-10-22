using LuxAuction.Dtos;
using LuxAuction.Models;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace LuxAuction.Repositories
{
    public interface IListingRepository
    {
        Task AddListingAsync(AuctionItem item);
        Task<IEnumerable<AuctionItem>> GetListingsBySellerIdAsync(int sellerId);
        Task<AuctionItem?> GetListingByIdAsync(int id); // Helper to find the item
        Task<bool> DeleteListingAsync(int id, int sellerId); // Delete only if sellerId matches
        Task<IEnumerable<AuctionItem>> GetAllActiveListingsAsync();
        Task<IEnumerable<AuctionItem>> GetActiveListingsAsync(AuctionQueryParameters parameters);
        Task<IEnumerable<AuctionItem>> GetFeaturedListingsAsync(int count);
    }
}