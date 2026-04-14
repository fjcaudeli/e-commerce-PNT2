using api.models.DTO;
using api.models.Entities;
using api.services.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.ecommerce.Controllers.v1
{
    [Route("api/cart")]
    [ApiController]
    [Authorize]

    public class CartController : ControllerBase
    {
        private readonly ICartRepository _service;

        public CartController(ICartRepository service)
        {
            _service = service;
        }

        [HttpGet("GetCart/{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
                return Ok(await _service.GetCart(userId));
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(CartDTO item)
        {
            return Ok(await _service.AddToCart(item));
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(CartDTO item)
        {
            return Ok(await _service.UpdateQuantity(item));
        }

        [HttpDelete("Remove/{cartId}")]
        public async Task<IActionResult> Remove(int cartId)
        {
            return Ok(await _service.RemoveFromCart(cartId));
        }
    }
}
