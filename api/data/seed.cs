
using System.Text;
using System.Security.Cryptography;
using System.Text.Json;
using api.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.data;
public class seed
{
    public static async Task SeedUsers(DataContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var userData = await System.IO.File.ReadAllTextAsync("data/userSeedData.json");
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
        if (users == null) return;
        users.ForEach((user) =>
        {
            using var hmac = new HMACSHA512();
            user.UserName = user.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("pass"));
            user.PasswordSalt = hmac.Key;
        });

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}