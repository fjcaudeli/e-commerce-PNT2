namespace api.models.Entities
{
    public class Cart
    {
        public int Id { get; set; }

        public int User_Id { get; set; }

        public int Product_Id { get; set; }

        public int Quantity { get; set; }
    }
}
