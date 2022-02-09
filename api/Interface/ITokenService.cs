using api.Entities;

namespace api.Interface;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}