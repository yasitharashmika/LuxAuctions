namespace LuxAuction.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string PasswordHash { get; set; }

        // --- ADD THIS LINE ---
        // Navigation property for all items this user is selling
        public virtual ICollection<AuctionItem> AuctionItems { get; set; }
    }
}