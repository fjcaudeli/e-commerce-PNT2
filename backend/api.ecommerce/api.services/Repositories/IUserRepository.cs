
using api.models.DTO;
using api.models.Responses;

namespace api.services.Repositories
{
    public interface IUserRepository
    {
        Task<string> GetUsers();
        Task<LoginResponse> Login(UserDTO user);
        Task<GeneralResponse> Register(UserDTO user);
    }
}
