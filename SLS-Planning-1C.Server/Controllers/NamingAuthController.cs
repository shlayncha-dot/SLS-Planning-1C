using Microsoft.AspNetCore.Mvc;
using SLS_Planning_1C.Server.Features.Naming;

namespace SLS_Planning_1C.Server.Controllers;

[ApiController]
[Route("api/naming-auth")]
public sealed class NamingAuthController : ControllerBase
{
    private readonly INamingCredentialsStore _credentialsStore;

    public NamingAuthController(INamingCredentialsStore credentialsStore)
    {
        _credentialsStore = credentialsStore;
    }

    [HttpGet("status")]
    public ActionResult<NamingAuthStatusResponse> GetStatus()
    {
        var hasCredentials = _credentialsStore.TryGet(out _);

        return Ok(new NamingAuthStatusResponse
        {
            IsConfigured = hasCredentials
        });
    }

    [HttpPost("credentials")]
    public IActionResult SaveCredentials([FromBody] NamingAuthCredentialsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Логин и пароль обязательны."
            });
        }

        _credentialsStore.Save(request.Username.Trim(), request.Password);
        return NoContent();
    }
}
