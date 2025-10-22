using LuxAuction.Models;

namespace LuxAuction.Repositories
{
    public interface IListingRepository
    {
        Task AddListingAsync(AuctionItem item);
    }
}