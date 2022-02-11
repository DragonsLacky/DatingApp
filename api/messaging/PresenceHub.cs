using api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace api.messaging;

[Authorize]
public class PresenceHub : Hub
{
    private readonly PresenceTracker _tracker;
    public PresenceHub(PresenceTracker tracker)
    {
        _tracker = tracker;
    }

    public override async Task OnConnectedAsync()
    {
        if (await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId))
        {
            await Clients.Others.SendAsync("UserIsOnline", Context?.User?.GetUsername());
        }

        var currentUsers = await _tracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        if (await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId))
        {
            await Clients.Others.SendAsync("UserIsOffline", Context?.User?.GetUsername());
        }

        await base.OnDisconnectedAsync(exception);
    }
}