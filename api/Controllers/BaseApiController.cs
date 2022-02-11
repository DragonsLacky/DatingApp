namespace api.Controllers;

[ApiController]
[ServiceFilter(typeof(LogUserActivities))]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

}