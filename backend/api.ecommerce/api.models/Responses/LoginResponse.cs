
namespace api.models.Responses
{
    public class LoginResponse
    {
        public int Codigo { get; set; }
        public string Mensaje { get; set; } = string.Empty;

        public bool Estado { get; set; }

        public string Token { get; set; } = string.Empty;

        public string FechaLogin { get; set; } = string.Empty;
    }
}
