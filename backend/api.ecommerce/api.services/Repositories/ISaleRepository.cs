
using api.models.Responses;

namespace api.services.Repositories
{
    public interface ISaleRepository
    {
        Task<GeneralResponse> ConfirmSale(int user_id);
        Task<string> GetSaleByUser(int user_id);
    }
}
