using Microsoft.AspNetCore.Mvc; // Required for [FromQuery] if used directly in controller, good practice here

namespace LuxAuction.Dtos
{
    public class AuctionQueryParameters
    {
        // Filtering
        [FromQuery(Name = "search")] // Maps query string "?search=term"
        public string? SearchTerm { get; set; }

        [FromQuery(Name = "category")] // Maps "?category=Rings"
        public string? Category { get; set; } = "All"; // Default to "All" if not provided

        [FromQuery(Name = "price")] // Maps "?price=1000-5000" or "?price=Under 1000" etc.
        public string? PriceRange { get; set; } = "All"; // Default to "All"

        // Sorting
        [FromQuery(Name = "sort")] // Maps "?sort=Ending Soon"
        public string? SortBy { get; set; } = "Ending Soon"; // Default sort order

        // Optional: Pagination (add later if needed)
        // public int PageNumber { get; set; } = 1;
        // public int PageSize { get; set; } = 10;
    }
}