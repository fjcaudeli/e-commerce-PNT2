using api.models.DTO;
using api.models.Entities;
using api.services.Repositories;
using Microsoft.AspNetCore.Mvc;
namespace api.ecommerce.Controllers.v1
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _service;

        public UserController(IUserRepository service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(await _service.GetUsers());
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserDTO user)
        {
            return Ok(await _service.Login(user));
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserDTO user)
        {
            return Ok(await _service.Register(user));
        }
    }
}
