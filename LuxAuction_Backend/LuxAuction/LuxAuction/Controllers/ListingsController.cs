using LuxAuction.Dtos;
using LuxAuction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Required for ClaimTypes
using System.IdentityModel.Tokens.Jwt;

namespace LuxAuction.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires a valid JWT
    public class ListingsController : ControllerBase
    {
        private readonly ListingService _listingService;

        public ListingsController(ListingService listingService)
        {
            _listingService = listingService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> Create([FromForm] CreateListingDto dto)
        {
            // --- ADD LOGGING HERE ---
            Console.WriteLine("--- Create Listing Endpoint Hit ---");
            Console.WriteLine($"Is Authenticated: {User.Identity?.IsAuthenticated}");
            Console.WriteLine("Claims found in token:");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"  Type: {claim.Type}, Value: {claim.Value}");
            }
            // ------------------------

            var sellerId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            // --- Log the result of finding the ID ---
            Console.WriteLine($"Attempting to find NameIdentifier claim. Result: {sellerId ?? "NOT FOUND"}");
            // ----------------------------------------

            if (string.IsNullOrEmpty(sellerId))
            {
                Console.WriteLine("ERROR: Seller ID (NameIdentifier) was null or empty."); // Log error
                return Unauthorized("User ID claim (NameIdentifier) not found in token.");
            }

            // --- Log before calling service ---
            Console.WriteLine($"Calling ListingService.CreateListingAsync for Seller ID: {sellerId}");
            // ----------------------------------

            var (success, message, createdItem) = await _listingService.CreateListingAsync(dto, sellerId);

            if (!success)
            {
                Console.WriteLine($"ERROR from ListingService: {message}"); // Log service error
                return BadRequest(new { message = $"Listing creation failed: {message}" });
            }

            Console.WriteLine($"SUCCESS: Listing created with ID: {createdItem?.Id}"); // Log success
            return CreatedAtAction(nameof(Create), new { id = createdItem.Id }, createdItem);
        }
    }
}

