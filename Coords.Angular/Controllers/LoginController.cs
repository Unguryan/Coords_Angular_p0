using Coords.Angular.Models;
using Microsoft.AspNetCore.Mvc;

namespace Coords.Angular.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        //[HttpGet]
        //[Route("auth")]
        //public async Task<AuthResultModel> AuthAsync()
        //{
        //    //var res = _telegramService.AuthLink();
        //    //mapper.Map<AuthResultModel>(res);
        //    return new AuthResultModel
        //    {
        //        Url = "https://t.me/TestTestCryptoBot?start=auth",
        //        Key = "auth"
        //    };
        //}
    }
}
