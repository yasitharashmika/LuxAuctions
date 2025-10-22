using LuxAuction.Dtos;
using LuxAuction.Models;
using LuxAuction.Repositories;
using System.Security.Claims;

namespace LuxAuction.Services
{
    public class ListingService
    {
        private readonly IListingRepository _listingRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ListingService(IListingRepository listingRepository, IWebHostEnvironment webHostEnvironment)
        {
            _listingRepository = listingRepository;
            _webHostEnvironment = webHostEnvironment; // Used to find the 'wwwroot' folder
        }

        public async Task<(bool Success, string Message, AuctionItem? CreatedItem)> CreateListingAsync(CreateListingDto dto, string sellerId)
        {
            // 1. Handle Image Uploads
            var imageUrls = new List<string>();
            if (dto.Images != null && dto.Images.Count > 0)
            {
                // Get the path to wwwroot/uploads
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                foreach (var image in dto.Images)
                {
                    if (image.Length > 0)
                    {
                        // Create a unique file name
                        string uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        // Save the file
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await image.CopyToAsync(fileStream);
                        }

                        // Save the web-accessible path
                        imageUrls.Add($"/uploads/{uniqueFileName}");
                    }
                }
            }

            // 2. Map DTO to Model
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
                SellerId = int.Parse(sellerId), // Convert the string ID from the token
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddDays(dto.AuctionDuration),
                Status = ListingStatus.Active, // Set as active immediately
                Materials = dto.Materials != null ? string.Join(",", dto.Materials) : null,
                ImageUrls = imageUrls.Count > 0 ? string.Join(",", imageUrls) : null
            };

            // 3. Save to Database
            await _listingRepository.AddListingAsync(auctionItem);

            return (true, "Listing created successfully.", auctionItem);
        }
    }
}