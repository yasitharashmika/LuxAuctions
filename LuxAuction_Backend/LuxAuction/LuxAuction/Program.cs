using LuxAuction.Data;
using LuxAuction.Repositories;
using LuxAuction.Repositories.Implementations;
using LuxAuction.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer; // For JWT
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; // For JWT
using System.Text; // For JWT

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add services to the container ---

// Add Database Connection
var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection") ?? "Server=(localdb)\\mssqllocaldb;Database=LuxAuction;Trusted_Connection=True;";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register your services for Dependency Injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();

// --- ADD NEW LISTING SERVICES ---
builder.Services.AddScoped<IListingRepository, ListingRepository>();
builder.Services.AddScoped<ListingService>();
// ---------------------------------

// Add CORS (So React can call the API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Your React app's URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// *** ADD JWT AUTHENTICATION ***
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"])),
            ValidateIssuer = false, // Set to true if you add an Issuer
            ValidateAudience = false, // Set to true if you add an Audience
        };
    });

// This line adds the Controllers (like AuthController)
builder.Services.AddControllers();

// Add Swagger for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 2. Configure the HTTP request pipeline ---
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- ADD STATIC FILES ---
// This allows the server to send image files from wwwroot
app.UseStaticFiles();
// ------------------------

app.UseCors("AllowReactApp"); // Use the CORS policy

// *** ADD AUTH MIDDLEWARE ***
// UseAuthentication must come before UseAuthorization
app.UseAuthentication();
app.UseAuthorization();

// This line automatically finds and uses your Controller routes
app.MapControllers();

app.Run();