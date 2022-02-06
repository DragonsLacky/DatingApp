using api.Entities;

namespace api.Extensions;

public static class QueryExtensions
{
    public static IQueryable<AppUser> OrderByField(this IQueryable<AppUser> query, string field)
    {
        return field switch
        {
            "created" => query.OrderByDescending(user => user.Created),
            _ => query.OrderByDescending(user => user.LastActive)
        };
    }
}