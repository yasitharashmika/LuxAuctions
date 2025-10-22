namespace LuxAuction.Dtos
{
    public class ListingDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public decimal StartingBid { get; set; }
        public decimal CurrentBid { get; set; } // We'll calculate or fetch this
        public int Bids { get; set; }           // We'll calculate or fetch this
        public string Status { get; set; }       // Convert enum to string
        public string TimeLeft { get; set; }     // We'll calculate this
        public string? ImageUrl { get; set; }    // Get the first image URL
    }
}