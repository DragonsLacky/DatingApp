using api.data;
using api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

public class BuggyController : BaseApiController
{
    private readonly DataContext _context;
    public BuggyController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetSecret()
    {
        return "secret text";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var user = _context.Users.Find(-1);
        if (user == null) return NotFound("Resource Not Found");
        return Ok(user);
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        var user = _context.Users.Find(-1);
        var userToReturn = user.ToString();

        return userToReturn;
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("This was a bad request");
    }
}