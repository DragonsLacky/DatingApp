using System.Text;
using api.data;
using api.Entities;
using api.Entities.enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace api.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {

        services.AddIdentityCore<AppUser>(options =>
        {
            options.Password.RequireNonAlphanumeric = false;
        })
        .AddRoles<AppRole>()
        .AddRoleManager<RoleManager<AppRole>>()
        .AddSignInManager<SignInManager<AppUser>>()
        .AddRoleValidator<RoleValidator<AppRole>>()
        .AddEntityFrameworkStores<DataContext>();


        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            context.Token = !string.IsNullOrEmpty(accessToken)
                                            && context.HttpContext.Request.Path.StartsWithSegments("/hubs")
                                            ? accessToken
                                            : context.Token;
                            return Task.CompletedTask;
                        }
                    };
                });

        services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole(AppRoleEnum.GetName<AppRoleEnum>(AppRoleEnum.Admin)));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole(
                    AppRoleEnum.GetName<AppRoleEnum>(AppRoleEnum.Admin),
                    AppRoleEnum.GetName<AppRoleEnum>(AppRoleEnum.Mod)
                ));
            }
        );

        return services;
    }
}