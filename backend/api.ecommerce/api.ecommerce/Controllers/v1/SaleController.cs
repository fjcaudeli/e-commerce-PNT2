using api.services.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.ecommerce.Controllers.v1
{
    [Route("api/compra")]
    [ApiController]
    [Authorize]
    public class SaleController : ControllerBase
    {
        private readonly ISaleRepository _service;

        public SaleController(ISaleRepository service)
        {
            _service = service;
        }

        [HttpPost("Confirm/{userId}")]
        public async Task<IActionResult> Confirm(int userId)
        {
            return Ok(await _service.ConfirmSale(userId));
        }

        [HttpGet("GetByUser/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            return Ok(await _service.GetSaleByUser(userId));
        }
    }   
}
