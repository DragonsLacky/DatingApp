using Model.Dtos;
using Model.Entities;
using Model.Params;

namespace Repository.Extensions;

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

    public static IQueryable<MessageDto> FilterByContainer(this IQueryable<MessageDto> query, MessageParams messageParams)
    {
        return messageParams.Container switch
        {
            "Inbox" => query.Where(msg => msg.RecipientUsername == messageParams.Username && !msg.RecipientDeleted),
            "Outbox" => query.Where(msg => msg.SenderUsername == messageParams.Username && !msg.SenderDeleted),
            _ => query.Where(msg => msg.RecipientUsername == messageParams.Username && !msg.RecipientDeleted && msg.DateRead == null)
        };
    }
}