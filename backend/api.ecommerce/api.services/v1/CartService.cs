
using api.services.Repositories;
using api.services.Handlers;
using api.models.DTO;
using api.models.Responses;
using Microsoft.IdentityModel.Tokens;

namespace api.services.v1
{
    public class CartService : ICartRepository
    {
        public async Task<string> GetCart(int userId)
        {
            string query = $"select c.id, c.user_id, c.product_id, c.quantity, p.product_name, p.price " +
                $"from cart c inner join products p on c.product_id = p.id " +
                $"where c.user_id = {userId}";
            return await Task.FromResult(SqliteHandler.GetJson(query));
        }

        public async Task<GeneralResponse> AddToCart(CartDTO item)
        {
            GeneralResponse result = new GeneralResponse();
            
            //verificacion si el producto esta en el cart
            string checkQuery = $"select * from cart where user_id = {item.User_Id} and product_id = {item.Product_Id}";
            string checkJson = SqliteHandler.GetJson(checkQuery);

            string query;
            if (checkJson != "[]")
            {
                //si ya existe sumo la cantidad
                query = $"update cart set quantity = quantity + {item.Quantity} " +
                    $"where user_id = {item.User_Id} and product_id = {item.Product_Id}";
            }
            else
            {
                query = $"insert into cart(user_id, product_id, quantity) " +
                    $"values ({item.User_Id},{item.Product_Id},{item.Quantity})";
            }

            bool success = SqliteHandler.Exec(query);
            result.Estado = success;
            result.Codigo = success ? 1 : 0;
            result.Mensaje = success ? "Producto agregado al carrito" : "No se pudo agregar el producto al carrito";

            return await Task.FromResult(result);
         
        }

        public async Task<GeneralResponse> UpdateQuantity(CartDTO item)
        {
            GeneralResponse result = new GeneralResponse();

            string query = $"update cart set quantity = {item.Quantity} " +
                $"where user_id = {item.User_Id} and product_id = {item.Product_Id}";

            bool success = SqliteHandler.Exec(query);
            result.Estado = success;
            result.Codigo = success ? 1 : 0;
            result.Mensaje = success ? "Cantidad actualizada" : "Error al actualizar";

            return await Task.FromResult(result);
        }

        public async Task<GeneralResponse> RemoveFromCart(int cartId)
        {
            GeneralResponse result = new GeneralResponse();

            string query = $"delete from cart where id = {cartId}";
            bool success = SqliteHandler.Exec(query);

            result.Estado = success;
            result.Codigo = success ? 1 : 0;
            result.Mensaje = success ? "Producto eliminado del carrito" : "Error al eliminar";

            return await Task.FromResult(result);
        }
    }
}
