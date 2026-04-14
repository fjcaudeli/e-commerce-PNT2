
using api.services.Handlers;
using api.services.Repositories;

namespace api.services.v1
{
    public class ProductService : IProductRepository
    {
        public async Task<string> GetProducts()
        {
            string query = "select * from products";
            return await Task.FromResult(SqliteHandler.GetJson(query));
        }

        public async Task<string> GetProductById(int id)
        {
            string query = $"select * from products where id = {id}";
            return await Task.FromResult(SqliteHandler.GetJson(query));
        }
    }
}
