using System.Collections.Immutable;
using api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<UserLike>? Likes { get; set; }
    public DbSet<Message>? Messages { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>()
            .HasMany(user => user.UserRoles)
            .WithOne(userRole => userRole.User)
            .HasForeignKey(userRole => userRole.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(role => role.UserRoles)
            .WithOne(userRole => userRole.Role)
            .HasForeignKey(userRole => userRole.RoleId)
            .IsRequired();

        builder.Entity<UserLike>()
                    .HasKey(k => new { k.SourceUserId, k.LikedUserId });

        builder.Entity<UserLike>()
                    .HasOne(ul => ul.SourceUser)
                    .WithMany(ul => ul.Liked)
                    .HasForeignKey(ul => ul.SourceUserId)
                    .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
                    .HasOne(ul => ul.LikedUser)
                    .WithMany(ul => ul.LikedBy)
                    .HasForeignKey(ul => ul.LikedUserId)
                    .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>()
            .HasOne(message => message.Recipient)
            .WithMany(user => user.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(message => message.Sender)
            .WithMany(user => user.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }

}