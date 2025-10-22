using LuxAuction.Models;

namespace LuxAuction.Repositories
{
    public interface IListingRepository
    {
        Task AddListingAsync(AuctionItem item);
        Task<IEnumerable<AuctionItem>> GetListingsBySellerIdAsync(int sellerId);
        Task<AuctionItem?> GetListingByIdAsync(int id); // Helper to find the item
        Task<bool> DeleteListingAsync(int id, int sellerId); // Delete only if sellerId matches
    }
}