
namespace api.models.Entities
{
    public class Sale_Information
    {
        public int Id { get; set; }
        public int Sale_Id { get; set; }
        public int Product_Id { get; set; }
        public int Quantity { get; set; }
        public decimal Unit_Price { get; set; }
    }
}
