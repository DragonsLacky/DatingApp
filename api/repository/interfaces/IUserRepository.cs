using api.Dtos;
using api.Entities;
using api.helpers;

namespace api.repository.interfaces;

public interface IUserRepository
{
    void Update(AppUser user);

    Task<bool> SaveAllAsync();

    Task<IEnumerable<AppUser>> GetUsersAsync();

    Task<AppUser> GetUserByIdAsync(int id);

    Task<AppUser> GetUserByUsernameAsync(string username);

    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);

    Task<MemberDto> GetMemberByUsername(string username);
}