using api.services.Handlers;
using api.services.Repositories;
using api.services.v1;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options => options.AddDefaultPolicy(builder =>
{
    builder.AllowAnyOrigin();
    builder.AllowAnyMethod();
    builder.AllowAnyHeader();
}));

// JWT
var jwtSection = builder.Configuration.GetSection("Jwt");
var secret = jwtSection["Secret"] ?? throw new InvalidOperationException("Jwt: Secret no configurado");
var issuer = jwtSection["Issuer"] ?? "api.ecommerce";
var audience = jwtSection["Audience"] ?? "ecommerce";

builder.Services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
    };
});

// SQLite
SqliteHandler.ConnectionString = builder.Configuration.GetConnectionString("defaultConnection");

// Dependencias
builder.Services.AddSingleton<IUserRepository, UserService>();
builder.Services.AddSingleton<IProductRepository, ProductService>();
builder.Services.AddSingleton<ICartRepository, CartService>();
builder.Services.AddSingleton<ISaleRepository, SaleService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "api.ecommerce");
    c.RoutePrefix = string.Empty;
});

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();  
app.UseAuthorization();   
app.MapControllers();      
app.Run();