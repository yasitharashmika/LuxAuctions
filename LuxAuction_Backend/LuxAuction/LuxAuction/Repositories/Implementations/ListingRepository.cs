using LuxAuction.Data;
using LuxAuction.Models;
using LuxAuction.Dtos; // Required for AuctionQueryParameters
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LuxAuction.Repositories.Implementations
{
    public class ListingRepository : IListingRepository
    {
        private readonly ApplicationDbContext _context;

        public ListingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Method to ADD a new listing
        public async Task AddListingAsync(AuctionItem item)
        {
            // Input validation (optional but good)
            if (item == null) throw new ArgumentNullException(nameof(item));

            await _context.AuctionItems.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        // Method to GET listings for a specific seller
        public async Task<IEnumerable<AuctionItem>> GetListingsBySellerIdAsync(int sellerId)
        {
            return await _context.AuctionItems
                .Where(item => item.SellerId == sellerId)
                .Include(item => item.Seller) // Include Seller details
                .OrderByDescending(item => item.StartTime) // Example order
                .ToListAsync();
        }

        // Method to GET a single listing by its ID (including Seller)
        public async Task<AuctionItem?> GetListingByIdAsync(int id)
        {
            return await _context.AuctionItems
                         .Include(item => item.Seller) // Include Seller details
                         .FirstOrDefaultAsync(item => item.Id == id); // Find by primary key
        }

        // Method to DELETE a listing owned by a specific seller
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

            // Return true if exactly one row was affected
            return changes == 1;
        }

        // Method to GET ACTIVE listings with filtering and sorting
        public async Task<IEnumerable<AuctionItem>> GetActiveListingsAsync(AuctionQueryParameters parameters)
        {
            var now = DateTime.UtcNow;

            // Start with base query for active items including Seller
            IQueryable<AuctionItem> query = _context.AuctionItems
                .Include(item => item.Seller) // Include seller details for SellerName
                .Where(item => item.Status == ListingStatus.Active &&
                               item.EndTime > now &&
                               item.StartTime <= now);

            // --- Apply Filters ---

            // 1. Filter by Search Term (Title or Seller Name)
            if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
            {
                var lowerSearchTerm = parameters.SearchTerm.ToLower().Trim();
                query = query.Where(item =>
                    (item.Title != null && item.Title.ToLower().Contains(lowerSearchTerm)) ||
                    (item.Seller != null && item.Seller.FullName != null && item.Seller.FullName.ToLower().Contains(lowerSearchTerm))
                // Add other searchable fields like description or category if needed
                // || (item.Description != null && item.Description.ToLower().Contains(lowerSearchTerm))
                // || (item.Category != null && item.Category.ToLower().Contains(lowerSearchTerm))
                );
            }

            // 2. Filter by Category
            if (!string.IsNullOrWhiteSpace(parameters.Category) && !parameters.Category.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(item => item.Category == parameters.Category);
            }

            // 3. Filter by Price Range (using StartingBid as placeholder for CurrentBid)
            // TODO: Update this when CurrentBid is available
            if (!string.IsNullOrWhiteSpace(parameters.PriceRange) && !parameters.PriceRange.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                switch (parameters.PriceRange)
                {
                    case "Under 1000":
                        query = query.Where(item => item.StartingBid < 1000); // Using StartingBid for now
                        break;
                    case "1000-5000":
                        query = query.Where(item => item.StartingBid >= 1000 && item.StartingBid < 5000);
                        break;
                    case "5000-10000":
                        query = query.Where(item => item.StartingBid >= 5000 && item.StartingBid < 10000);
                        break;
                    case "Over 10000":
                        query = query.Where(item => item.StartingBid >= 10000);
                        break;
                        // Add validation or ignore invalid price ranges
                }
            }

            // --- Apply Sorting ---
            switch (parameters.SortBy)
            {
                case "Newly Listed":
                    query = query.OrderByDescending(item => item.StartTime); // Sort by start/creation time
                    break;
                case "Most Bids":
                    // TODO: Implement actual bid count sorting when bids are added
                    // query = query.OrderByDescending(item => item.Bids.Count()); // Example
                    query = query.OrderByDescending(item => item.Id); // Placeholder: sort by ID descending (crude proxy for new)
                    break;
                case "Price High to Low":
                    // TODO: Use CurrentBid when available
                    query = query.OrderByDescending(item => item.StartingBid); // Using StartingBid as placeholder
                    break;
                case "Price Low to High":
                    // TODO: Use CurrentBid when available
                    query = query.OrderBy(item => item.StartingBid); // Using StartingBid as placeholder
                    break;
                case "Ending Soon":
                default: // Default sort order
                    query = query.OrderBy(item => item.EndTime); // Order by the auction end date/time
                    break;
            }

            // TODO: Apply Pagination if parameters include PageNumber/PageSize
            // query = query.Skip((parameters.PageNumber - 1) * parameters.PageSize).Take(parameters.PageSize);

            // Execute the final constructed query
            return await query.ToListAsync();
        }

        // Implementation for GetAllActiveListingsAsync to fix CS0535
        public async Task<IEnumerable<AuctionItem>> GetAllActiveListingsAsync()
        {
            var now = DateTime.UtcNow;

            // Fetch all active listings
            return await _context.AuctionItems
                .Include(item => item.Seller) // Include seller details
                .Where(item => item.Status == ListingStatus.Active &&
                               item.EndTime > now &&
                               item.StartTime <= now)
                .ToListAsync();
        }
        public async Task<IEnumerable<AuctionItem>> GetFeaturedListingsAsync(int count)
        {
            var now = DateTime.UtcNow;
            return await _context.AuctionItems
                // Filter for active items
                .Where(item => item.Status == ListingStatus.Active &&
                               item.EndTime > now &&
                               item.StartTime <= now)
                // Include Seller details
                .Include(item => item.Seller)
                // Order by ending soonest
                .OrderBy(item => item.EndTime)
                // Take only the specified number of items
                .Take(count)
                .ToListAsync();
        }
    }
}