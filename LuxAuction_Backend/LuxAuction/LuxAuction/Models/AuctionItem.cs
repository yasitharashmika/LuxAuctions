using System.ComponentModel.DataAnnotations.Schema;

namespace LuxAuction.Models
{
    public enum ListingStatus
    {
        Pending,
        Active,
        Sold,
        Expired,
        Cancelled
    }

    public class AuctionItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public decimal StartingBid { get; set; }
        public decimal? ReservePrice { get; set; } // Nullable if optional
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Condition { get; set; }
        public string? Era { get; set; }

        // We will store lists as comma-separated strings for simplicity
        public string? Materials { get; set; }
        public string? ImageUrls { get; set; }

        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }
        public bool HasCertificates { get; set; }
        public string? ShippingInfo { get; set; }
        public ListingStatus Status { get; set; }

        // --- Foreign Key for the Seller ---
        // This connects the listing to the user who created it
        public int SellerId { get; set; }
        [ForeignKey("SellerId")]
        public virtual User Seller { get; set; }
    }
}