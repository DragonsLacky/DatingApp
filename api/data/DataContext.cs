using api.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<AppUser>? Users { get; set; }

}