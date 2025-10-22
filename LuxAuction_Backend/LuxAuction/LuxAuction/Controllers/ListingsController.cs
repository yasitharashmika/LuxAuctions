using LuxAuction.Dtos;
using LuxAuction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Required for ClaimTypes
using System.IdentityModel.Tokens.Jwt; // Required for JwtRegisteredClaimNames if used elsewhere
using Microsoft.Extensions.Logging; // Required for ILogger
using Microsoft.AspNetCore.Http; // Required for StatusCodes
using System.Linq; // Required for Count()
using System; // Required for StringComparison, Guid
using System.Threading.Tasks; // Required for Task<IActionResult>
using System.Collections.Generic; // Required for List<T>

namespace LuxAuction.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires a valid JWT for most actions by default unless overridden by [AllowAnonymous]
    public class ListingsController : ControllerBase
    {
        private readonly ListingService _listingService;
        private readonly ILogger<ListingsController> _logger; // Use ILogger for logging

        // Constructor to inject services and logger via Dependency Injection
        public ListingsController(ListingService listingService, ILogger<ListingsController> logger)
        {
            _listingService = listingService;
            _logger = logger;
        }

        // --- Endpoint to CREATE a new listing ---
        // POST /api/listings/create
        [HttpPost("create")]
        [Authorize(Roles = "Seller")] // Only users with the "Seller" role can access this
        public async Task<IActionResult> Create([FromForm] CreateListingDto dto) // [FromForm] is needed for file uploads (IFormFile)
        {
            _logger.LogInformation("--- Create Listing Endpoint Hit ---");
            _logger.LogDebug("Received DTO: Title='{Title}', Category='{Category}', StartingBid={StartingBid}, ImageCount={ImageCount}",
                dto?.Title, dto?.Category, dto?.StartingBid, dto?.Images?.Count ?? 0);

            // Extract Seller ID from the validated token's claims
            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Attempting to find NameIdentifier claim. Result: {SellerIdResult}", sellerId ?? "NOT FOUND");

            // Check if the Seller ID claim was found in the token
            if (string.IsNullOrEmpty(sellerId))
            {
                _logger.LogWarning("Seller ID (NameIdentifier) was null or empty. Token might be missing claim or validation failed.");
                // Return 401 Unauthorized if the ID claim is missing (should be rare if [Authorize] passed)
                return Unauthorized(new { message = "User ID claim (NameIdentifier) not found in token." });
            }

            _logger.LogInformation("Calling ListingService.CreateListingAsync for Seller ID: {SellerId}", sellerId);

            // Call the service layer to handle business logic, file saving, and database interaction
            var (success, message, createdItem) = await _listingService.CreateListingAsync(dto, sellerId);

            // Handle potential failure from the service layer
            if (!success || createdItem == null)
            {
                _logger.LogError("Error from ListingService during creation for Seller ID {SellerId}: {ErrorMessage}", sellerId, message);
                // Return 400 Bad Request with the specific error message
                return BadRequest(new { message = $"Listing creation failed: {message}" });
            }

            _logger.LogInformation("SUCCESS: Listing created with ID: {ListingId} for Seller ID: {SellerId}", createdItem.Id, sellerId);
            // Return 201 Created status on success.
            // Provides the newly created item in the response body.
            // Sets the 'Location' header pointing to where the resource *could* be retrieved (optional).
            // Using GetActiveListings route name as a placeholder - ideally point to a GetById/{id} endpoint if created.
            return CreatedAtAction(nameof(GetActiveListings), new { /* id = createdItem.Id */ }, createdItem);
        }


        // --- Endpoint to GET listings for the logged-in seller ---
        // GET /api/listings/my-listings
        [HttpGet("my-listings")]
        [Authorize(Roles = "Seller")] // Only Sellers can access their own listings
        public async Task<IActionResult> GetMyListings()
        {
            _logger.LogInformation("--- GetMyListings Endpoint Hit ---");

            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Attempting to find NameIdentifier claim for GetMyListings. Result: {SellerIdResult}", sellerId ?? "NOT FOUND");

            if (string.IsNullOrEmpty(sellerId))
            {
                _logger.LogWarning("Seller ID (NameIdentifier) was null or empty in GetMyListings.");
                return Unauthorized(new { message = "User ID claim (NameIdentifier) not found in token." }); // 401
            }

            _logger.LogInformation("Calling ListingService.GetMyListingsAsync for Seller ID: {SellerId}", sellerId);

            try
            {
                var listings = await _listingService.GetMyListingsAsync(sellerId);
                _logger.LogInformation("Successfully retrieved {ListingCount} listings for Seller ID: {SellerId}", listings.Count(), sellerId);
                return Ok(listings); // 200 OK with the list of ListingDto
            }
            catch (Exception ex) // Catch unexpected errors from the service/repository
            {
                _logger.LogError(ex, "An unexpected error occurred in GetMyListings for Seller ID: {SellerId}", sellerId);
                // Return 500 Internal Server Error for unhandled exceptions
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching your listings." });
            }
        }

        // --- Endpoint to GET all ACTIVE listings (PUBLIC, with filtering/sorting) ---
        // GET /api/listings/active?search=term&category=cat&price=range&sort=order
        [HttpGet("active")]
        [AllowAnonymous] // Overrides the controller-level [Authorize], making this public
        public async Task<IActionResult> GetActiveListings([FromQuery] AuctionQueryParameters parameters) // Bind query string params
        {
            _logger.LogInformation("--- GetActiveListings Endpoint Hit --- QueryParams: Search={Search}, Cat={Category}, Price={Price}, Sort={Sort}",
                parameters.SearchTerm, parameters.Category, parameters.PriceRange, parameters.SortBy);

            try
            {
                // Call the service method that handles filtering and sorting
                var listings = await _listingService.GetActiveListingsFilteredAsync(parameters);
                _logger.LogInformation("Successfully retrieved {ListingCount} active listings based on parameters.", listings.Count());
                return Ok(listings); // 200 OK with the potentially filtered/sorted list
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in GetActiveListings.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching active listings." }); // 500
            }
        }

        // --- Endpoint to GET FEATURED listings (PUBLIC) ---
        // GET /api/listings/featured?count=3
        [HttpGet("featured")]
        [AllowAnonymous] // Public access
        public async Task<IActionResult> GetFeaturedListings([FromQuery] int count = 3) // Optional count, defaults to 3
        {
            _logger.LogInformation("--- GetFeaturedListings Endpoint Hit (Count: {Count}) ---", count);

            // Basic validation for count parameter
            if (count <= 0 || count > 10) // Example limit: fetch between 1 and 10 items
            {
                count = 3; // Reset to default if invalid
                _logger.LogWarning("Invalid count requested for featured listings, defaulting to {DefaultCount}.", count);
            }

            try
            {
                var listings = await _listingService.GetFeaturedListingsAsync(count);
                _logger.LogInformation("Successfully retrieved {ListingCount} featured listings.", listings.Count());
                return Ok(listings); // 200 OK with data
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in GetFeaturedListings.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching featured listings." }); // 500
            }
        }


        // --- Endpoint to DELETE a listing ---
        // DELETE /api/listings/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Seller")] // Only Sellers can delete their own listings
        public async Task<IActionResult> DeleteListing(int id)
        {
            _logger.LogInformation("--- Delete Listing Endpoint Hit for ID: {ListingId} ---", id);

            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Attempting to find NameIdentifier claim for DeleteListing. Result: {SellerIdResult}", sellerId ?? "NOT FOUND");

            if (string.IsNullOrEmpty(sellerId))
            {
                _logger.LogWarning("Seller ID (NameIdentifier) was null or empty in DeleteListing.");
                return Unauthorized(new { message = "User ID claim (NameIdentifier) not found in token." }); // 401
            }

            _logger.LogInformation("Calling ListingService.DeleteListingAsync for Listing ID: {ListingId}, Seller ID: {SellerId}", id, sellerId);

            // Call the service to attempt deletion
            var (success, message) = await _listingService.DeleteListingAsync(id, sellerId);

            if (!success)
            {
                _logger.LogError("Error from ListingService during deletion of Listing ID {ListingId} for Seller ID {SellerId}: {ErrorMessage}", id, sellerId, message);
                // Return 404 Not Found if the service indicated item not found or permission denied
                if (message.Contains("not found", StringComparison.OrdinalIgnoreCase) || message.Contains("permission", StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new { message }); // 404
                }
                // Otherwise, return 400 Bad Request for other failures (like DB errors reported by service)
                return BadRequest(new { message }); // 400
            }

            _logger.LogInformation("SUCCESS: Deleted Listing ID: {ListingId} for Seller ID: {SellerId}", id, sellerId);
            // Return 204 No Content for successful deletion (standard REST practice)
            return NoContent(); // 204
        }
    }
}