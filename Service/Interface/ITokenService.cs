using Model.Entities;

namespace Service.Interface;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}