using api.models.DTO;
using api.models.Entities;
using api.models.Responses;
using api.services.Handlers;
using api.services.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api.services.v1
{
    public class UserService : IUserRepository
    {
        private readonly IConfiguration _configuration;

        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> GetUsers()
        {
            string query = "select * from users";
            string json = SqliteHandler.GetJson(query);
            return await Task.FromResult(json);
        }

        public async Task<LoginResponse> Login(UserLoginDTO user) 
        {
            string query = $"select * from users where username =" +
                $"'{user.Username}' and password = '{user.Password}'";

            string json = SqliteHandler.GetJson(query);
            LoginResponse result = new LoginResponse();

            if (json == "[]")
            {
                result.Estado = false;
                result.Codigo = 0;
                result.Mensaje = "Credenciales Invalidas";
                result.Token = "";
                result.FechaLogin = "";
                
                return await Task.FromResult(result);
            }
            var userList = JsonConvert.DeserializeObject<List<User>>(json);
            var userDb = userList?.FirstOrDefault();

            result.Estado = true;
            result.Codigo = 1;
            result.Mensaje = "Login exitoso";
            result.FechaLogin = DateTime.Now.ToString();

            JwtHandler jwt = new JwtHandler(_configuration);
            result.Token = jwt.CrearJWT(userDb.Username, userDb.Id, userDb.Name);

            return await Task.FromResult(result);
        }

        public async Task<GeneralResponse> Register(UserRegisterDTO user)
        {
            GeneralResponse result = new GeneralResponse();

            string checkQuery = $"select * from users where username = '{user.Username}'";
            string checkJson = SqliteHandler.GetJson(checkQuery);

            if (checkJson != "[]")
            {
                result.Estado = false;
                result.Codigo = 0;
                result.Mensaje = "El nombre de usuario ya existe";
                return await Task.FromResult(result);
            }

            string query = $"insert into users (username, password, name, email) " +
                $"values ('{user.Username}', '{user.Password}', '{user.Name}', '{user.Email}')";
            bool success = SqliteHandler.Exec(query);

            result.Estado = success;
            result.Codigo = success ? 1 : 0;
            result.Mensaje = success ? "Usuario registrado correctamente" : "Error al registrar";

            return await Task.FromResult(result);
        }
         
    }
}
