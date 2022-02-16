using Microsoft.AspNetCore.Identity;

namespace Model.Entities;

public class AppUser : IdentityUser<int>
{
    public DateTime DateOfBirth { get; set; }
    public string? KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string? Gender { get; set; }
    public string? Introduction { get; set; }
    public string? LookingFor { get; set; }
    public string? Interests { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public virtual ICollection<Photo> Photos { get; set; }
    public virtual ICollection<UserLike> Liked { get; set; }
    public virtual ICollection<UserLike> LikedBy { get; set; }
    public virtual ICollection<Message> MessagesSent { get; set; }
    public virtual ICollection<Message> MessagesReceived { get; set; }
    public virtual ICollection<AppUserRole> UserRoles { get; set; }
}