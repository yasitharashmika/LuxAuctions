using System.ComponentModel.DataAnnotations;

namespace LuxAuction.Dtos
{
    // This DTO matches the 'formData' state in your React component
    public class CreateListingDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal StartingBid { get; set; }
        public decimal? ReservePrice { get; set; }
        [Required]
        public int AuctionDuration { get; set; } // React sends "7", which converts to int
        public List<string>? Materials { get; set; }
        public string? Era { get; set; }
        public string Condition { get; set; }
        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }
        public bool Certificates { get; set; }
        public string? ShippingInfo { get; set; }

        // --- FOR FILE UPLOADS ---
        // The form field name in React must be 'images'
        public List<IFormFile>? Images { get; set; }
    }
}