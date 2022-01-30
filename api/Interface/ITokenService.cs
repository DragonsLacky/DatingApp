using api.Entities;

namespace api.Interface;

public interface ITokenService
{
    string CreateToken(AppUser user);
}