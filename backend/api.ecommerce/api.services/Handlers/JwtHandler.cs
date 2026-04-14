using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.Extensions.Configuration;

namespace api.services.Handlers
{
    public class JwtHandler
    {
        private readonly IConfiguration _configuration;

        public JwtHandler(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public string CrearJWT(string usuario, int? idUsuario, string nombre)
        {
            var jwt = _configuration.GetSection("Jwt"); //En base a la info q trae este archivo, generamos el token
            var secret = jwt["Secret"] ?? throw new InvalidOperationException("Jwt: Secret no configurado");
            var issuer = jwt["Issuer"] ?? "microservicio.login";
            var audience = jwt["Audience"] ?? "microservicio.login";
            var minutes = int.TryParse(jwt["ExpirationMinutes"], out var m) ? m : 0;

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, usuario),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.Name,usuario)
            };

            if (idUsuario.HasValue)
            {
                claims.Add(new Claim(ClaimTypes.NameIdentifier, idUsuario.Value.ToString()));
            }

            if (!string.IsNullOrEmpty(nombre))
            {
                claims.Add(new Claim(ClaimTypes.GivenName, nombre));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)); //Esta linea termina creando eltoken con todo lo de arriba
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);//HMCACSHA256 es el algoritmo de encriptacion-

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(minutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
