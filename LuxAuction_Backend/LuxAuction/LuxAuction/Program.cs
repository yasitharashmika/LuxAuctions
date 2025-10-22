using LuxAuction.Data;
using LuxAuction.Repositories;
using LuxAuction.Repositories.Implementations;
using LuxAuction.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Logging; // ADDED: Required for logging configuration
using System; // ADDED: Required for InvalidOperationException, TimeSpan
using Microsoft.OpenApi.Models; // ADDED: Required for OpenApiSecurityScheme etc.
using System.Collections.Generic; // ADDED: Required for List<string>

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add services to the container ---

// Configure Logging (Optional but recommended)
builder.Logging.ClearProviders(); // Removes default providers if needed
builder.Logging.AddConsole();     // Adds logging to the console output
builder.Logging.AddDebug();       // Adds logging to the debug output window in VS
// Configure log levels in appsettings.json or appsettings.Development.json
// Example appsettings.Development.json:
// { "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning", "LuxAuction": "Debug" } } }

// Add Database Connection with null check
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in configuration."); // Ensure connection string exists
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Repositories & Services for Dependency Injection (Scoped lifetime is typical)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IListingRepository, ListingRepository>();
builder.Services.AddScoped<ListingService>();

// Add CORS Policy (allows requests from your React frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Your React app's URL
                  .AllowAnyHeader()  // Allow standard headers
                  .AllowAnyMethod(); // Allow GET, POST, DELETE etc.
            // Consider .AllowCredentials() if you need cookies/auth headers from frontend JS across origins
        });
});

// Add Authentication (JWT Bearer Scheme) with null check for Key
var jwtKey = builder.Configuration["Jwt:Key"] // Read secret key from configuration
    ?? throw new InvalidOperationException("Jwt:Key not found in configuration. Make sure it's set in appsettings.json or user secrets.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => // Configure JWT validation
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true, // Must validate the signature
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)), // Key for validation

            // Set these to false if you DON'T include "iss" or "aud" claims in your tokens
            ValidateIssuer = false,
            ValidateAudience = false,

            ValidateLifetime = true, // Check the "exp" claim (recommended)
            ClockSkew = TimeSpan.FromMinutes(1) // Allow a small tolerance for clock differences (optional)
        };
        // Optional: Add event handlers for debugging JWT validation
        // options.Events = new JwtBearerEvents {
        //     OnAuthenticationFailed = context => { Console.WriteLine("JWT Auth Failed: " + context.Exception.Message); return Task.CompletedTask; },
        //     OnTokenValidated = context => { Console.WriteLine("JWT Token Validated for: " + context.Principal?.Identity?.Name); return Task.CompletedTask; }
        // };
    });

// Add Authorization services (needed for [Authorize] and role checks)
builder.Services.AddAuthorization();

// Add Controllers service (finds and registers your API controllers)
builder.Services.AddControllers();

// Add API Explorer & Swagger/OpenAPI generation
builder.Services.AddEndpointsApiExplorer(); // Required for minimal APIs and Swagger metadata
builder.Services.AddSwaggerGen(c => // Configure Swagger document generation
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LuxAuction API", Version = "v1" });

    // Configure Swagger to use JWT Bearer Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header, // Where the token is sent
        Type = SecuritySchemeType.Http, // Use Http type for Bearer scheme
        Scheme = "Bearer" // The scheme name
    });

    // Make Swagger UI include the Bearer token in requests
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
       {
         new OpenApiSecurityScheme {
           Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } // Reference the definition above
         },
         new List<string>() // No specific scopes needed for this scheme
       }
     });
});


// --- 2. Configure the HTTP request pipeline (order matters!) ---
var app = builder.Build();

// Configure middleware based on the environment (Development vs. Production)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable middleware to serve the generated Swagger JSON endpoint
    app.UseSwaggerUI(c => // Enable middleware to serve the Swagger UI HTML page
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LuxAuction API V1"); // Point UI to the JSON endpoint
        // c.RoutePrefix = string.Empty; // Uncomment to serve Swagger UI at app's root ('/') instead of '/swagger'
    });
    app.UseDeveloperExceptionPage(); // Show detailed error pages for developers
}
else
{
    // Production settings
    app.UseExceptionHandler("/Error"); // Redirect unhandled exceptions to a generic error page/endpoint
    app.UseHsts(); // Add HTTP Strict Transport Security header (enforces HTTPS)
}

// Redirect HTTP requests to HTTPS (recommended for security)
app.UseHttpsRedirection();

// Serve static files (e.g., uploaded images) from the wwwroot folder
// IMPORTANT: Ensure the 'wwwroot' folder exists in your project root
app.UseStaticFiles();

// Enable Routing (needed before endpoints and CORS in some cases)
app.UseRouting(); // Add this explicitly if needed, often implicitly added by MapControllers in newer .NET

// Apply the CORS policy globally (AllowReactApp)
app.UseCors("AllowReactApp");

// IMPORTANT: Authentication middleware MUST come before Authorization middleware
app.UseAuthentication(); // Reads the token, validates it, sets HttpContext.User
app.UseAuthorization();  // Checks [Authorize] attributes against the identified user

// Map controller endpoints based on their routes and attributes
app.MapControllers();

// Start the application and begin listening for incoming requests
app.Run();