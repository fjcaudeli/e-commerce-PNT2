
using api.models.DTO;
using api.models.Responses;

namespace api.services.Repositories
{
    public interface IUserRepository
    {
        Task<string> GetUsers();
        Task<LoginResponse> Login(UserLoginDTO user);
        Task<GeneralResponse> Register(UserRegisterDTO user);
    }
}
