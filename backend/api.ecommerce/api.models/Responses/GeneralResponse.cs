
namespace api.models.Responses
{
    public class GeneralResponse
    {
        public int Codigo { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public bool Estado { get; set; }
    }
}
