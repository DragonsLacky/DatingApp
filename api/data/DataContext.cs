using System.Collections.Immutable;
using api.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<AppUser>? Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserLike>()
                    .HasKey(k => new { k.SourceUserId, k.LikedUserId });

        modelBuilder.Entity<UserLike>()
                    .HasOne(ul => ul.SourceUser)
                    .WithMany(ul => ul.Liked)
                    .HasForeignKey(ul => ul.SourceUserId)
                    .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserLike>()
                    .HasOne(ul => ul.LikedUser)
                    .WithMany(ul => ul.LikedBy)
                    .HasForeignKey(ul => ul.LikedUserId)
                    .OnDelete(DeleteBehavior.Cascade);
    }

}