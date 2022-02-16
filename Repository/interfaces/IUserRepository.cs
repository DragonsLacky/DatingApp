using Model.Dtos;
using Model.Entities;
using Model.Params;

namespace Repository.interfaces;

public interface IUserRepository
{
    void Update(AppUser user);

    Task<IEnumerable<AppUser>> GetUsersAsync();

    Task<AppUser> GetUserByIdAsync(int id);

    Task<AppUser> GetUserByUsernameAsync(string username);

    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);

    Task<MemberDto> GetMemberByUsername(string username);

    Task<string> GetUserGender(string username);
}