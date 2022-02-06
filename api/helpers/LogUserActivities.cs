using api.Extensions;
using api.repository.interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace api.helpers;

public class LogUserActivities : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();
        if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

        var usedId = resultContext.HttpContext.User.GetUserId();

        var userRepository = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
        if (userRepository == null) return;

        var user = await userRepository.GetUserByIdAsync(usedId);
        user.LastActive = DateTime.Now;

        await userRepository.SaveAllAsync();
    }
}