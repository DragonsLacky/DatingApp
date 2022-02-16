using Microsoft.AspNetCore.Mvc;
using Service.Helpers;

namespace Web.Controllers;

[ApiController]
[ServiceFilter(typeof(LogUserActivities))]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

}