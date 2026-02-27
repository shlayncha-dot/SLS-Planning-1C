using Microsoft.AspNetCore.Mvc;
using SLS_Planning_1C.Server.Features.Naming;

namespace SLS_Planning_1C.Server.Controllers;

[ApiController]
[Route("api/verification")]
public sealed class NamingController : ControllerBase
{
    private readonly INamingService _namingService;

    public NamingController(INamingService namingService)
    {
        _namingService = namingService;
    }

    [HttpPost("naming")]
    public async Task<ActionResult<NamingCheckResponse>> CheckNaming([FromBody] NamingCheckRequest request, CancellationToken cancellationToken)
    {
        var response = await _namingService.CheckAsync(request, cancellationToken);
        return Ok(response);
    }
}
