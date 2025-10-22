using LuxAuction.Dtos;
using LuxAuction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Required for ClaimTypes
using System.IdentityModel.Tokens.Jwt; // Required for JwtRegisteredClaimNames if used elsewhere
using Microsoft.Extensions.Logging; // Required for ILogger
using Microsoft.AspNetCore.Http; // Required for StatusCodes
using System.Linq; // Required for Count()

namespace LuxAuction.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires a valid JWT for all actions in this controller
    public class ListingsController : ControllerBase
    {
        private readonly ListingService _listingService;
        private readonly ILogger<ListingsController> _logger; // Use ILogger

        // Updated constructor to inject ILogger
        public ListingsController(ListingService listingService, ILogger<ListingsController> logger)
        {
            _listingService = listingService;
            _logger = logger;
        }

        // --- Endpoint to CREATE a new listing ---
        [HttpPost("create")]
        [Authorize(Roles = "Seller")] // Only Sellers can create listings
        public async Task<IActionResult> Create([FromForm] CreateListingDto dto)
        {
            _logger.LogInformation("--- Create Listing Endpoint Hit ---");
            _logger.LogDebug("Received DTO: Title='{Title}', Category='{Category}', StartingBid={StartingBid}, ImageCount={ImageCount}",
                dto?.Title, dto?.Category, dto?.StartingBid, dto?.Images?.Count ?? 0); // Log key DTO details

            _logger.LogInformation("Is Authenticated: {IsAuthenticated}", User.Identity?.IsAuthenticated);
            _logger.LogInformation("Claims found in token:");
            foreach (var claim in User.Claims)
            {
                _logger.LogInformation("  Type: {ClaimType}, Value: {ClaimValue}", claim.Type, claim.Value);
            }

            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Attempting to find NameIdentifier claim. Result: {SellerIdResult}", sellerId ?? "NOT FOUND");

            if (string.IsNullOrEmpty(sellerId))
            {
                _logger.LogWarning("Seller ID (NameIdentifier) was null or empty. Token might be missing claim or validation failed.");
                return Unauthorized("User ID claim (NameIdentifier) not found in token."); // 401
            }

            _logger.LogInformation("Calling ListingService.CreateListingAsync for Seller ID: {SellerId}", sellerId);

            var (success, message, createdItem) = await _listingService.CreateListingAsync(dto, sellerId);

            if (!success)
            {
                _logger.LogError("Error from ListingService during creation for Seller ID {SellerId}: {ErrorMessage}", sellerId, message);
                // Return 400 Bad Request with the specific error message from the service
                return BadRequest(new { message = $"Listing creation failed: {message}" });
            }

            _logger.LogInformation("SUCCESS: Listing created with ID: {ListingId} for Seller ID: {SellerId}", createdItem?.Id, sellerId);
            // Return 201 Created status with the location and the created item details
            // Point the location header to where the new resource *could* be retrieved (e.g., a future GetById endpoint)
            return CreatedAtAction(nameof(GetMyListings), new { /* No ID needed for GetMyListings route */ }, createdItem);
        }

        // --- Endpoint to GET listings for the logged-in seller ---
        [HttpGet("my-listings")]      // Route: GET /api/listings/my-listings
        [Authorize(Roles = "Seller")] // Only Sellers can access their listings
        public async Task<IActionResult> GetMyListings()
        {
            _logger.LogInformation("--- GetMyListings Endpoint Hit ---");

            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Attempting to find NameIdentifier claim for GetMyListings. Result: {SellerIdResult}", sellerId ?? "NOT FOUND");

            if (string.IsNullOrEmpty(sellerId))
            {
                _logger.LogWarning("Seller ID (NameIdentifier) was null or empty in GetMyListings.");
                return Unauthorized("User ID claim (NameIdentifier) not found in token."); // 401
            }

            _logger.LogInformation("Calling ListingService.GetMyListingsAsync for Seller ID: {SellerId}", sellerId);

            try
            {
                var listings = await _listingService.GetMyListingsAsync(sellerId);
                _logger.LogInformation("Successfully retrieved {ListingCount} listings for Seller ID: {SellerId}", listings.Count(), sellerId);
                // Return 200 OK with the list of listing DTOs
                return Ok(listings);
            }
            catch (Exception ex) // Catch potential exceptions from the service/repo layer
            {
                _logger.LogError(ex, "An unexpected error occurred in GetMyListings for Seller ID: {SellerId}", sellerId);
                // Return 500 Internal Server Error for unhandled exceptions
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching listings." });
            }
        }

        // --- Endpoint to DELETE a listing ---
        [HttpDelete("{id}")]          // Route: DELETE /api/listings/{id} (e.g., /api/listings/5)
        [Authorize(Roles = "Seller")] // Only Sellers can delete their listings
        public async Task<IActionResult> DeleteListing(int id)
        {
            _logger.LogInformation("--- Delete Listing Endpoint Hit for ID: {ListingId} ---", id);

            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Attempting to find NameIdentifier claim for DeleteListing. Result: {SellerIdResult}", sellerId ?? "NOT FOUND");

            if (string.IsNullOrEmpty(sellerId))
            {
                _logger.LogWarning("Seller ID (NameIdentifier) was null or empty in DeleteListing.");
                return Unauthorized("User ID claim (NameIdentifier) not found in token."); // 401
            }

            _logger.LogInformation("Calling ListingService.DeleteListingAsync for Listing ID: {ListingId}, Seller ID: {SellerId}", id, sellerId);

            var (success, message) = await _listingService.DeleteListingAsync(id, sellerId);

            if (!success)
            {
                _logger.LogError("Error from ListingService during deletion of Listing ID {ListingId} for Seller ID {SellerId}: {ErrorMessage}", id, sellerId, message);
                // If the item wasn't found or didn't belong to user, return 404 Not Found
                if (message.Contains("not found", StringComparison.OrdinalIgnoreCase) || message.Contains("permission", StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new { message }); // 404
                }
                // Otherwise, it might be another error (like DB error from service)
                return BadRequest(new { message }); // 400
            }

            _logger.LogInformation("SUCCESS: Deleted Listing ID: {ListingId} for Seller ID: {SellerId}", id, sellerId);
            // Return 204 No Content for successful deletion (standard REST practice)
            return NoContent(); // 204
        }
    }
}