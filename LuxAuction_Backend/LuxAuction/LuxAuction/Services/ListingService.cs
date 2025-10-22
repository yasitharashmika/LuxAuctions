using LuxAuction.Dtos;
using LuxAuction.Models;
using LuxAuction.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging; // ADDED: Required for ILogger
using System.Linq;
using Microsoft.EntityFrameworkCore; // ADDED: Required for DbUpdateException
using System; // ADDED: Required for Guid, DateTime, Math, StringSplitOptions, Exception
using System.Collections.Generic; // ADDED: Required for List<T>
using System.IO; // ADDED: Required for Path, Directory, FileStream, FileMode
using System.Threading.Tasks; // ADDED: Required for Task
using System.Security.Claims; // Keep for potential future use

namespace LuxAuction.Services
{
    public class ListingService
    {
        private readonly IListingRepository _listingRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<ListingService> _logger; // ADDED: Use ILogger

        // Updated constructor to inject ILogger
        public ListingService(
            IListingRepository listingRepository,
            IWebHostEnvironment webHostEnvironment,
            ILogger<ListingService> logger) // ADDED: logger parameter
        {
            _listingRepository = listingRepository;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger; // Store the logger instance
        }

        // --- Method to CREATE a new listing ---
        public async Task<(bool Success, string Message, AuctionItem? CreatedItem)> CreateListingAsync(CreateListingDto dto, string sellerId)
        {
            _logger.LogInformation("CreateListingAsync started for Seller ID: {SellerId}", sellerId);

            if (!int.TryParse(sellerId, out int sellerIdInt))
            {
                _logger.LogWarning("Invalid Seller ID format '{SellerId}' in CreateListingAsync.", sellerId);
                return (false, "Invalid Seller ID format.", null);
            }
            if (dto == null)
            {
                _logger.LogWarning("CreateListingAsync called with null DTO for Seller ID {SellerId}.", sellerIdInt);
                return (false, "Listing data cannot be null.", null);
            }
            // TODO: Consider adding more server-side validation for DTO properties

            var imageUrls = new List<string>();
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath ?? string.Empty, "uploads");

            // Ensure wwwroot/uploads directory exists
            if (!string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
            {
                if (!Directory.Exists(uploadsFolder))
                {
                    try
                    {
                        _logger.LogInformation("Creating uploads directory: {UploadsFolder}", uploadsFolder);
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to create uploads directory: {UploadsFolder}", uploadsFolder);
                        return (false, $"Server error creating directory: {ex.Message}", null);
                    }
                }
            }
            else
            {
                _logger.LogWarning("WebRootPath is null or empty. Cannot save images.");
                // Decide if image upload failure is critical based on requirements
                if (dto.Images != null && dto.Images.Count > 0)
                {
                    return (false, "Image upload failed: Server wwwroot path not configured.", null);
                }
            }

            // Process Images if directory exists and images were provided
            if (dto.Images != null && dto.Images.Count > 0 && !string.IsNullOrEmpty(_webHostEnvironment.WebRootPath) && Directory.Exists(uploadsFolder))
            {
                _logger.LogInformation("Processing {ImageCount} images for Seller ID: {SellerId}", dto.Images.Count, sellerIdInt);
                foreach (var image in dto.Images)
                {
                    if (image != null && image.Length > 0)
                    {
                        // Basic validation for image type and size (optional but recommended)
                        // var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                        // var ext = Path.GetExtension(image.FileName).ToLowerInvariant();
                        // if (string.IsNullOrEmpty(ext) || !allowedExtensions.Contains(ext)) {
                        //     _logger.LogWarning("Invalid image file type '{FileName}' for Seller ID {SellerId}", image.FileName, sellerIdInt);
                        //     return (false, $"Invalid image file type: {image.FileName}. Allowed types: {string.Join(", ", allowedExtensions)}", null);
                        // }
                        // if (image.Length > 5 * 1024 * 1024) { // Example: 5MB limit
                        //     _logger.LogWarning("Image file too large '{FileName}' ({FileSize} bytes) for Seller ID {SellerId}", image.FileName, image.Length, sellerIdInt);
                        //     return (false, $"Image file '{image.FileName}' is too large (max 5MB).", null);
                        // }

                        try
                        {
                            string safeFileName = Path.GetFileName(image.FileName);
                            string uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
                            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                            _logger.LogDebug("Saving image to: {FilePath}", filePath);
                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                await image.CopyToAsync(fileStream);
                            }
                            imageUrls.Add($"/uploads/{uniqueFileName}"); // Use forward slashes for URL path
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error saving image '{FileName}' for Seller ID {SellerId}", image.FileName, sellerIdInt);
                            // Decide if one failed image should stop the whole process
                            return (false, $"Error saving image '{image.FileName}': {ex.Message}", null);
                        }
                    }
                }
            }
            else if (dto.Images != null && dto.Images.Count > 0)
            {
                _logger.LogWarning("Skipping image save because uploads directory is not available for Seller ID: {SellerId}", sellerIdInt);
                // Again, decide if this should be a hard failure based on requirements
                // return (false, "Image upload failed: Server directory not configured.", null);
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
                SellerId = sellerIdInt, // Use the parsed integer ID
                StartTime = DateTime.UtcNow, // Auction starts now
                EndTime = DateTime.UtcNow.AddDays(dto.AuctionDuration), // Calculate end time
                Status = ListingStatus.Active, // Default status
                Materials = (dto.Materials != null && dto.Materials.Any()) ? string.Join(",", dto.Materials) : null,
                ImageUrls = (imageUrls.Any()) ? string.Join(",", imageUrls) : null
            };

            // Save to Database
            try
            {
                await _listingRepository.AddListingAsync(auctionItem);
                _logger.LogInformation("Successfully created listing ID: {ListingId} for Seller ID: {SellerId}", auctionItem.Id, sellerIdInt);
                return (true, "Listing created successfully.", auctionItem);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database update error creating listing for Seller ID {SellerId}: {InnerExceptionMessage}", sellerIdInt, dbEx.InnerException?.Message);
                return (false, $"Database error saving listing: {dbEx.InnerException?.Message ?? dbEx.Message}", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Generic error creating listing for Seller ID {SellerId}", sellerIdInt);
                return (false, $"An unexpected error occurred: {ex.Message}", null);
            }
        }


        // --- Method to GET listings for the logged-in Seller ---
        public async Task<IEnumerable<ListingDto>> GetMyListingsAsync(string sellerId)
        {
            _logger.LogInformation("GetMyListingsAsync started for Seller ID: {SellerId}", sellerId);

            if (!int.TryParse(sellerId, out int sellerIdInt))
            {
                _logger.LogWarning("Invalid sellerId format '{SellerId}' provided to GetMyListingsAsync.", sellerId);
                return Enumerable.Empty<ListingDto>();
            }

            IEnumerable<AuctionItem> items;
            try
            {
                _logger.LogDebug("Fetching listings from repository for Seller ID: {SellerId}", sellerIdInt);
                items = await _listingRepository.GetListingsBySellerIdAsync(sellerIdInt);
                _logger.LogInformation("Found {ItemCount} listings for Seller ID: {SellerId}", items.Count(), sellerIdInt);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching listings from database for Seller ID {SellerId}", sellerIdInt);
                // Consider throwing exception or returning specific error DTO
                return Enumerable.Empty<ListingDto>(); // Return empty on DB error
            }

            // Map database models to DTOs
            var dtos = items.Select(item => new ListingDto
            {
                Id = item.Id,
                Title = item.Title,
                Category = item.Category,
                StartingBid = item.StartingBid,
                Status = item.Status.ToString(),
                ImageUrl = GetFirstImageUrl(item.ImageUrls),
                // TODO: Replace placeholders with real bid data (requires Bid entity/logic)
                CurrentBid = item.StartingBid, // Placeholder
                Bids = 0,                      // Placeholder
                TimeLeft = CalculateTimeLeft(item.StartTime, item.EndTime, item.Status)
            }).ToList(); // Execute the projection

            return dtos;
        }

        // --- Method to DELETE a listing ---
        public async Task<(bool Success, string Message)> DeleteListingAsync(int id, string sellerId)
        {
            _logger.LogInformation("DeleteListingAsync started for Listing ID: {ListingId}, Seller ID: {SellerId}", id, sellerId);

            if (!int.TryParse(sellerId, out int sellerIdInt))
            {
                _logger.LogWarning("Invalid Seller ID format '{SellerId}' provided for deletion.", sellerId);
                return (false, "Invalid Seller ID format.");
            }

            // Optional: Business logic check (e.g., cannot delete active listing with bids)
            // var item = await _listingRepository.GetListingByIdAsync(id);
            // if (item != null && item.SellerId == sellerIdInt && item.Status == ListingStatus.Active /* && HasBids(id) */) {
            //     _logger.LogWarning("Attempted to delete active listing {ListingId} with bids by Seller {SellerId}", id, sellerIdInt);
            //     return (false, "Cannot delete an active listing with bids.");
            // }

            try
            {
                _logger.LogDebug("Calling repository to delete Listing ID: {ListingId} for Seller ID: {SellerId}", id, sellerIdInt);
                // Fetch item first to get image URLs before deleting
                var itemToDelete = await _listingRepository.GetListingByIdAsync(id);

                if (itemToDelete == null || itemToDelete.SellerId != sellerIdInt)
                {
                    _logger.LogWarning("Listing ID: {ListingId} not found or does not belong to Seller ID: {SellerId} during delete attempt.", id, sellerIdInt);
                    return (false, "Listing not found or you do not have permission to delete it.");
                }

                // Now attempt deletion from DB
                bool deleted = await _listingRepository.DeleteListingAsync(id, sellerIdInt); // This method in repo handles the check again, slightly redundant but safe

                if (deleted)
                {
                    _logger.LogInformation("Successfully deleted Listing ID: {ListingId} from database for Seller ID: {SellerId}", id, sellerIdInt);

                    // --- Delete associated image files ---
                    DeleteImageFiles(itemToDelete.ImageUrls);
                    // ------------------------------------

                    return (true, "Listing deleted successfully.");
                }
                else
                {
                    // This case might happen if item was deleted between Get and Delete calls (race condition)
                    _logger.LogWarning("Listing ID: {ListingId} could not be deleted for Seller ID: {SellerId}. Might have been deleted already.", id, sellerIdInt);
                    return (false, "Listing could not be deleted. It might have been removed already.");
                }
            }
            catch (DbUpdateException dbEx) // Catch potential DB constraint issues
            {
                _logger.LogError(dbEx, "Database error deleting Listing ID {ListingId} for Seller {SellerId}: {InnerExceptionMessage}", id, sellerIdInt, dbEx.InnerException?.Message);
                return (false, $"Database error during deletion: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Generic error deleting Listing ID: {ListingId} for Seller ID: {SellerId}", id, sellerIdInt);
                return (false, $"An unexpected error occurred while deleting the listing: {ex.Message}");
            }
        }


        // --- Helper Methods ---

        // Gets the first image URL from a comma-separated string
        private string? GetFirstImageUrl(string? imageUrls)
        {
            if (string.IsNullOrWhiteSpace(imageUrls)) return null;
            return imageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                            .FirstOrDefault();
        }

        // Calculates a user-friendly string for time remaining or status
        private string CalculateTimeLeft(DateTime startTime, DateTime endTime, ListingStatus status)
        {
            var now = DateTime.UtcNow;

            // Handle non-active or future start times first
            if (status != ListingStatus.Active || startTime > now)
            {
                if (startTime > now) // Future start
                {
                    TimeSpan timeUntilStart = startTime - now;
                    if (timeUntilStart.TotalDays >= 2) return $"Starts in {Math.Floor(timeUntilStart.TotalDays)} days";
                    if (timeUntilStart.TotalHours >= 1) return $"Starts in {Math.Floor(timeUntilStart.TotalHours)} hours";
                    if (timeUntilStart.TotalMinutes >= 1) return $"Starts in {Math.Floor(timeUntilStart.TotalMinutes)} minutes";
                    return "Starts soon";
                }
                else // Status is Pending (but start time passed), Sold, Expired, Cancelled
                {
                    // If Pending but should be active, let active calc handle it
                    if (status == ListingStatus.Pending && startTime <= now && endTime > now) { /* Fall through */ }
                    else { return status.ToString(); } // Return status name
                }
            }

            // Handle active auctions
            if (endTime < now)
            {
                return ListingStatus.Expired.ToString(); // Or "Sold" based on logic
            }

            // Calculate time remaining for active, currently running auctions
            TimeSpan timeLeft = endTime - now;

            if (timeLeft.TotalDays >= 2) return $"{Math.Floor(timeLeft.TotalDays)}d left";
            if (timeLeft.TotalHours >= 1) return $"{Math.Floor(timeLeft.TotalHours)}h {timeLeft.Minutes}m left";
            if (timeLeft.TotalMinutes >= 1) return $"{timeLeft.Minutes}m {timeLeft.Seconds}s left";
            if (timeLeft.TotalSeconds > 0) return $"{Math.Floor(timeLeft.TotalSeconds)}s left";

            return ListingStatus.Expired.ToString(); // Fallback if time is exactly up
        }

        // --- NEW Helper Method to Delete Image Files ---
        private void DeleteImageFiles(string? imageUrls)
        {
            if (string.IsNullOrWhiteSpace(imageUrls) || string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
            {
                return; // Nothing to delete or cannot determine path
            }

            var urls = imageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            foreach (var url in urls)
            {
                try
                {
                    // Construct the physical path from the web path (/uploads/...)
                    // Trim leading '/' and use Path.Combine
                    var relativePath = url.TrimStart('/');
                    var fullPath = Path.Combine(_webHostEnvironment.WebRootPath, relativePath);

                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                        _logger.LogInformation("Deleted image file: {FilePath}", fullPath);
                    }
                    else
                    {
                        _logger.LogWarning("Image file not found for deletion: {FilePath}", fullPath);
                    }
                }
                catch (Exception ex)
                {
                    // Log error but continue trying to delete other files
                    _logger.LogError(ex, "Error deleting image file corresponding to URL: {ImageUrl}", url);
                }
            }
        }
        // ------------------------------------------
    }
}