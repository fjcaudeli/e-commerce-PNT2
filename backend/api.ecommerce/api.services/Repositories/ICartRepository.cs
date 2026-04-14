
using api.models.DTO;
using api.models.Responses;

namespace api.services.Repositories
{
    public interface ICartRepository
    {
        Task<string> GetCart(int user_id);
        Task<GeneralResponse> AddToCart(CartDTO item);

        Task<GeneralResponse> UpdateQuantity(CartDTO item);

        Task<GeneralResponse> RemoveFromCart(int cart_id);
    }
}
