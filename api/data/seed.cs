
using System.Text.Json;
using api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using api.Entities.enums;

namespace api.data;
public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var userData = await System.IO.File.ReadAllTextAsync("data/userSeedData.json");
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
        if (users == null) return;

        AppRoleEnum.GetNames<AppRoleEnum>().Select(role => new AppRole(role)).ToList().ForEach(async role => await roleManager.CreateAsync(role));

        var memberRole = AppRoleEnum.GetName<AppRoleEnum>(AppRoleEnum.Member);
        var modRole = AppRoleEnum.GetName<AppRoleEnum>(AppRoleEnum.Mod);
        var adminRole = AppRoleEnum.GetName<AppRoleEnum>(AppRoleEnum.Admin);

        users.ForEach(async (user) =>
        {
            user.UserName = user.UserName.ToLower();
            await userManager.CreateAsync(user, "P@ss10");
            await userManager.AddToRoleAsync(user, memberRole);
        });

        var admin = new AppUser
        {
            UserName = "admin"
        };
        await userManager.CreateAsync(admin, "P@ss10");
        await userManager.AddToRolesAsync(admin, (new[] { memberRole, adminRole }));


    }
}