using LuxAuction.Dtos;
using LuxAuction.Models;
using LuxAuction.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting; // Often needed for IWebHostEnvironment extensions
using Microsoft.Extensions.Logging; // Required for ILogger
using System.Linq;
using Microsoft.EntityFrameworkCore; // Required for DbUpdateException
using System;
using System.Collections.Generic;
using System.IO; // Required for Path, Directory, File, FileStream, FileMode
using System.Threading.Tasks; // Required for Task

namespace LuxAuction.Services
{
    public class ListingService
    {
        private readonly IListingRepository _listingRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<ListingService> _logger;

        // Constructor accepting injected dependencies
        public ListingService(
            IListingRepository listingRepository,
            IWebHostEnvironment webHostEnvironment,
            ILogger<ListingService> logger)
        {
            _listingRepository = listingRepository;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        // --- Method to CREATE a new listing ---
        public async Task<(bool Success, string Message, AuctionItem? CreatedItem)> CreateListingAsync(CreateListingDto dto, string sellerId)
        {
            _logger.LogInformation("Service: CreateListingAsync started for Seller ID: {SellerId}", sellerId);

            if (!int.TryParse(sellerId, out int sellerIdInt))
            {
                _logger.LogWarning("Service: Invalid Seller ID format '{SellerId}'.", sellerId);
                return (false, "Invalid Seller ID format.", null);
            }
            if (dto == null)
            {
                _logger.LogWarning("Service: CreateListingAsync called with null DTO for Seller ID {SellerId}.", sellerIdInt);
                return (false, "Listing data cannot be null.", null);
            }
            // Basic server-side validation
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Category) || string.IsNullOrWhiteSpace(dto.Description) || dto.StartingBid < 0)
            {
                _logger.LogWarning("Service: Required fields missing/invalid in CreateListingDto for Seller ID {SellerId}.", sellerIdInt);
                return (false, "Title, Category, Description, and a non-negative Starting Bid are required.", null);
            }

            var imageUrls = new List<string>();
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath ?? string.Empty, "uploads");

            // Ensure uploads directory exists
            bool uploadsDirectoryAvailable = false;
            if (!string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
            {
                uploadsDirectoryAvailable = Directory.Exists(uploadsFolder);
                if (!uploadsDirectoryAvailable)
                {
                    try
                    {
                        _logger.LogInformation("Service: Creating uploads directory: {UploadsFolder}", uploadsFolder);
                        Directory.CreateDirectory(uploadsFolder);
                        uploadsDirectoryAvailable = true;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Service: Failed to create uploads directory: {UploadsFolder}", uploadsFolder);
                        return (false, $"Server error creating image directory: {ex.Message}", null);
                    }
                }
            }
            else
            {
                _logger.LogWarning("Service: WebRootPath is null or empty. Cannot save images.");
                if (dto.Images != null && dto.Images.Count > 0) return (false, "Image upload failed: Server wwwroot path not configured.", null);
            }

            // Process Images
            if (dto.Images != null && dto.Images.Count > 0)
            {
                if (!uploadsDirectoryAvailable)
                {
                    _logger.LogWarning("Service: Cannot save images, uploads directory not available for Seller ID: {SellerId}", sellerIdInt);
                    return (false, "Image upload failed: Server directory error.", null);
                }
                _logger.LogInformation("Service: Processing {ImageCount} images for Seller ID: {SellerId}", dto.Images.Count, sellerIdInt);
                foreach (var image in dto.Images)
                {
                    if (image != null && image.Length > 0)
                    {
                        // TODO: Add robust image validation (type, size)
                        try
                        {
                            string safeFileName = Path.GetFileName(image.FileName);
                            string uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
                            string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                            _logger.LogDebug("Service: Saving image to: {FilePath}", filePath);
                            using (var fileStream = new FileStream(filePath, FileMode.Create)) { await image.CopyToAsync(fileStream); }
                            imageUrls.Add($"/uploads/{uniqueFileName}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Service: Error saving image '{FileName}' for Seller ID {SellerId}", image.FileName, sellerIdInt);
                            return (false, $"Error saving image '{image.FileName}': {ex.Message}", null);
                        }
                    }
                }
            }

            // Map DTO to Model
            var auctionItem = new AuctionItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                StartingBid = dto.StartingBid,
                ReservePrice = dto.ReservePrice,
                Condition = dto.Condition,
                Era = dto.Era,
                Weight = dto.Weight,
                Dimensions = dto.Dimensions,
                HasCertificates = dto.Certificates,
                ShippingInfo = dto.ShippingInfo,
                SellerId = sellerIdInt,
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddDays(dto.AuctionDuration),
                Status = ListingStatus.Active,
                Materials = (dto.Materials != null && dto.Materials.Any()) ? string.Join(",", dto.Materials) : null,
                ImageUrls = (imageUrls.Any()) ? string.Join(",", imageUrls) : null
            };

            // Save to Database
            try
            {
                await _listingRepository.AddListingAsync(auctionItem);
                _logger.LogInformation("Service: Successfully created listing ID: {ListingId} for Seller ID: {SellerId}", auctionItem.Id, sellerIdInt);
                return (true, "Listing created successfully.", auctionItem);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Service: Database error creating listing for Seller ID {SellerId}: {InnerExceptionMessage}", sellerIdInt, dbEx.InnerException?.Message);
                return (false, $"Database error saving listing: {dbEx.InnerException?.Message ?? dbEx.Message}", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service: Generic error creating listing for Seller ID {SellerId}", sellerIdInt);
                return (false, $"An unexpected error occurred: {ex.Message}", null);
            }
        }

        // --- Method to GET listings for the logged-in Seller ---
        public async Task<IEnumerable<ListingDto>> GetMyListingsAsync(string sellerId)
        {
            _logger.LogInformation("Service: GetMyListingsAsync started for Seller ID: {SellerId}", sellerId);
            if (!int.TryParse(sellerId, out int sellerIdInt))
            {
                _logger.LogWarning("Service: Invalid sellerId format '{SellerId}' in GetMyListingsAsync.", sellerId);
                return Enumerable.Empty<ListingDto>();
            }

            IEnumerable<AuctionItem> items;
            try
            {
                _logger.LogDebug("Service: Fetching listings from repo for Seller ID: {SellerId}", sellerIdInt);
                items = await _listingRepository.GetListingsBySellerIdAsync(sellerIdInt);
                _logger.LogInformation("Service: Found {ItemCount} listings for Seller ID: {SellerId}", items.Count(), sellerIdInt);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service: Error fetching listings from DB for Seller ID {SellerId}", sellerIdInt);
                throw; // Re-throw
            }
            return items.Select(item => MapAuctionItemToListingDto(item)).ToList();
        }

        // --- Method to GET ALL ACTIVE listings (filtered and sorted) ---
        public async Task<IEnumerable<ListingDto>> GetActiveListingsFilteredAsync(AuctionQueryParameters parameters)
        {
            _logger.LogInformation("Service: GetActiveListingsFilteredAsync started. Query: {@Parameters}", parameters);
            IEnumerable<AuctionItem> items;
            try
            {
                _logger.LogDebug("Service: Fetching filtered active listings from repo.");
                items = await _listingRepository.GetActiveListingsAsync(parameters);
                _logger.LogInformation("Service: Found {ItemCount} active listings matching criteria.", items.Count());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service: Error fetching filtered active listings from DB.");
                throw; // Re-throw
            }
            return items.Select(item => MapAuctionItemToListingDto(item)).ToList();
        }

        // --- Method to GET FEATURED listings ---
        public async Task<IEnumerable<ListingDto>> GetFeaturedListingsAsync(int count = 3)
        {
            _logger.LogInformation("Service: GetFeaturedListingsAsync started (Count: {Count}).", count);
            IEnumerable<AuctionItem> items;
            try
            {
                _logger.LogDebug("Service: Fetching {Count} featured listings from repository.", count);
                items = await _listingRepository.GetFeaturedListingsAsync(count);
                _logger.LogInformation("Service: Found {ItemCount} featured listings.", items.Count());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service: Error fetching featured listings from database.");
                throw; // Re-throw
            }
            return items.Select(item => MapAuctionItemToListingDto(item)).ToList();
        }


        // --- Method to DELETE a listing ---
        public async Task<(bool Success, string Message)> DeleteListingAsync(int id, string sellerId)
        {
            _logger.LogInformation("Service: DeleteListingAsync started for Listing ID: {ListingId}, Seller ID: {SellerId}", id, sellerId);
            if (!int.TryParse(sellerId, out int sellerIdInt))
            {
                _logger.LogWarning("Service: Invalid Seller ID format '{SellerId}' for deletion.", sellerId);
                return (false, "Invalid Seller ID format.");
            }

            try
            {
                _logger.LogDebug("Service: Fetching listing ID {ListingId} for deletion check.", id);
                var itemToDelete = await _listingRepository.GetListingByIdAsync(id);

                if (itemToDelete == null || itemToDelete.SellerId != sellerIdInt)
                {
                    _logger.LogWarning("Service: Listing ID: {ListingId} not found or doesn't belong to Seller ID: {SellerId} during delete.", id, sellerIdInt);
                    return (false, "Listing not found or you do not have permission to delete it.");
                }

                // Optional: Add business logic check (e.g., cannot delete if active bids exist)

                _logger.LogDebug("Service: Calling repository to delete Listing ID: {ListingId} for Seller ID: {SellerId}", id, sellerIdInt);
                bool deleted = await _listingRepository.DeleteListingAsync(id, sellerIdInt);

                if (deleted)
                {
                    _logger.LogInformation("Service: Successfully deleted Listing ID: {ListingId} from DB for Seller ID: {SellerId}", id, sellerIdInt);
                    DeleteImageFiles(itemToDelete.ImageUrls); // Delete associated files
                    return (true, "Listing deleted successfully.");
                }
                else
                {
                    _logger.LogWarning("Service: Repository reported failure deleting Listing ID: {ListingId} for Seller ID: {SellerId}.", id, sellerIdInt);
                    return (false, "Listing could not be deleted from database.");
                }
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Service: Database error deleting Listing ID {ListingId} for Seller {SellerId}: {InnerExceptionMessage}", id, sellerIdInt, dbEx.InnerException?.Message);
                return (false, $"Database error during deletion: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service: Generic error deleting Listing ID: {ListingId} for Seller ID: {SellerId}", id, sellerIdInt);
                return (false, $"An unexpected error occurred while deleting: {ex.Message}");
            }
        }

        // --- Helper Method for consistent DTO Mapping ---
        private ListingDto MapAuctionItemToListingDto(AuctionItem item)
        {
            return new ListingDto
            {
                Id = item.Id,
                Title = item.Title,
                Category = item.Category,
                StartingBid = item.StartingBid,
                Status = item.Status.ToString(),
                ImageUrl = GetFirstImageUrl(item.ImageUrls),
                SellerName = item.Seller?.FullName ?? "Unknown Seller", // Safely use included Seller data
                                                                        // TODO: Replace placeholders with real bid data when implemented
                CurrentBid = item.StartingBid, // Placeholder
                Bids = 0,                      // Placeholder
                TimeLeft = CalculateTimeLeft(item.StartTime, item.EndTime, item.Status)
            };
        }

        // --- Helper Methods (GetFirstImageUrl, CalculateTimeLeft, DeleteImageFiles) ---
        private string? GetFirstImageUrl(string? imageUrls)
        {
            if (string.IsNullOrWhiteSpace(imageUrls)) return null;
            return imageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).FirstOrDefault();
        }

        private string CalculateTimeLeft(DateTime startTime, DateTime endTime, ListingStatus status)
        {
            var now = DateTime.UtcNow;
            if (status != ListingStatus.Active || startTime > now)
            {
                if (startTime > now)
                { // Future
                    TimeSpan ts = startTime - now;
                    if (ts.TotalDays >= 2) return $"Starts in {Math.Floor(ts.TotalDays)}d";
                    if (ts.TotalHours >= 1) return $"Starts in {Math.Floor(ts.TotalHours)}h";
                    if (ts.TotalMinutes >= 1) return $"Starts in {Math.Floor(ts.TotalMinutes)}m";
                    return "Starts soon";
                }
                else
                { // Not Active or Pending (but should be active)
                    if (status == ListingStatus.Pending && endTime > now) { /* Fall through */ }
                    else { return status.ToString(); }
                }
            }
            if (endTime < now) { return ListingStatus.Expired.ToString(); } // Ended
            TimeSpan tl = endTime - now; // Time Remaining
            if (tl.TotalDays >= 2) return $"{Math.Floor(tl.TotalDays)}d {tl.Hours}h left";
            if (tl.TotalHours >= 1) return $"{Math.Floor(tl.TotalHours)}h {tl.Minutes}m left";
            if (tl.TotalMinutes >= 1) return $"{tl.Minutes}m {tl.Seconds}s left";
            if (tl.TotalSeconds > 0) return $"{Math.Floor(tl.TotalSeconds)}s left";
            return ListingStatus.Expired.ToString(); // Fallback
        }

        private void DeleteImageFiles(string? imageUrls)
        {
            if (string.IsNullOrWhiteSpace(imageUrls) || string.IsNullOrEmpty(_webHostEnvironment.WebRootPath)) return;
            var urls = imageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            _logger.LogInformation("Service: Attempting to delete {UrlCount} associated image files.", urls.Length);
            foreach (var url in urls)
            {
                if (!url.StartsWith("/uploads/"))
                {
                    _logger.LogWarning("Service: Skipped deleting potential unsafe file path: {ImageUrl}", url); continue;
                }
                try
                {
                    var relativePath = url.TrimStart('/');
                    var fullPath = Path.Combine(_webHostEnvironment.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                        _logger.LogInformation("Service: Deleted image file: {FilePath}", fullPath);
                    }
                    else
                    {
                        _logger.LogWarning("Service: Image file not found for deletion: {FilePath}", fullPath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Service: Error deleting image file {ImageUrl}", url);
                }
            }
        }
    }
}