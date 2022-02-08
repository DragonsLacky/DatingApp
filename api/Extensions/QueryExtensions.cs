using api.Entities;
using api.helpers;

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

    public static IQueryable<Message> FilterByContainer(this IQueryable<Message> query, MessageParams messageParams)
    {
        return messageParams.Container switch
        {
            "Inbox" => query.Where(msg => msg.Recipient.UserName == messageParams.Username && !msg.RecipientDeleted),
            "Outbox" => query.Where(msg => msg.Sender.UserName == messageParams.Username && !msg.SenderDeleted),
            _ => query.Where(msg => msg.Recipient.UserName == messageParams.Username && !msg.RecipientDeleted && msg.DateRead == null)
        };
    }
}