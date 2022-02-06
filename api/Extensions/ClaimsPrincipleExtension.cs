using System.Security.Claims;

namespace api.Extensions;

public static class ClaimsPrincipleExtension
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Name)?.Value;
    }
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userdId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userdId);
    }
}