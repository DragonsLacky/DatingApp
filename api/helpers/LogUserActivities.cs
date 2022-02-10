using api.Extensions;
using api.Interface;
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

        var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
        if (unitOfWork.UserRepository == null) return;

        var user = await unitOfWork.UserRepository.GetUserByIdAsync(usedId);
        user.LastActive = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync();
    }
}