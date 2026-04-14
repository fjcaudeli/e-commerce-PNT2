

namespace api.services.Repositories
{
    public interface IProductRepository
    {
        Task<string> GetProducts();
        Task<string> GetProductById(int id);
    }
}
