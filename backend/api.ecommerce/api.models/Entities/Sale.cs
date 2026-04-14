
namespace api.models.Entities
{
    public class Sale
    {
        public int Id { get; set; }

        public int User_Id { get; set; }

        public decimal Total { get; set; }

        public required string Date { get; set; }
    }
}
