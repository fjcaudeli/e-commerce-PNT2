
using api.models.Responses;
using api.services.Handlers;
using api.services.Repositories;
using Newtonsoft.Json;

namespace api.services.v1
{
    public class SaleService : ISaleRepository
    {
        public async Task<GeneralResponse> ConfirmSale(int userId)
        {
            GeneralResponse result = new GeneralResponse();

            // Traigo el carrito del usuario con precios
            string cartQuery = $"select c.product_id, c.quantity, p.price " +
                                  $"from cart c inner join products p on c.product_id = p.id " +
                                  $"where c.user_id = {userId}";
            string cartJson = SqliteHandler.GetJson(cartQuery);

            if (cartJson == "[]")
            {
                result.Estado = false;
                result.Codigo = 0;
                result.Mensaje = "El carrito está vacío";
                return await Task.FromResult(result);
            }

            // Calculo el total
            var items = JsonConvert.DeserializeObject<List<dynamic>>(cartJson);
            decimal total = 0;
            foreach (var item in items)
            {
                total += (decimal)item.price * (int)item.cantidad;
            }

            // Inserto la compra
            string fecha = DateTime.Now.ToString();
            string saleQuery = $"insert into sale(user_id, total, fecha) values ({userId}, {total.ToString()}, '{fecha}')";
            SqliteHandler.Exec(saleQuery);

            // Obtengo el id de la compra recién insertada
            string lastIdJson = SqliteHandler.GetJson("select last_insert_rowid() as id");
            var lastId = JsonConvert.DeserializeObject<List<dynamic>>(lastIdJson);
            int compraId = (int)lastId[0].id;

            // Inserto el detalle
            foreach (var item in items)
            {
                string informationQuery = $"insert into sale_information(compra_id, product_id, quantity, precio_unitario) " +
                                      $"values ({compraId}, {item.product_id}, {item.quantity}, {(decimal)item.price})";
                SqliteHandler.Exec(informationQuery);

                // Descuento el stock
                string stockQuery = $"update products set stock = stock - {item.quantity} where id = {item.product_id}";
                SqliteHandler.Exec(stockQuery);
            }

            // Limpio el carrito
            SqliteHandler.Exec($"delete from cart where user_id = {userId}");

            result.Estado = true;
            result.Codigo = 1;
            result.Mensaje = $"Compra confirmada. Total: ${total}";

            return await Task.FromResult(result);
        }

        public async Task<string> GetSaleByUser(int userId)
        {
            string query = $"select * from sale where user_id = {userId}";
            return await Task.FromResult(SqliteHandler.GetJson(query));
        }
    }
}