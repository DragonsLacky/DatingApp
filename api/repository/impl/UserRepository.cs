using api.data;
using api.Dtos;
using api.Entities;
using api.Extensions;
using api.helpers;
using api.repository.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api.repository.impl;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public UserRepository(DataContext context, IMapper mapper)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<MemberDto> GetMemberByUsername(string username)
    {
        return await _context.Users
                        .Where(user => user.UserName == username)
                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                        .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {

        var minAge = DateTime.Today.AddYears(-userParams.MaxAge - 1).ToUniversalTime();
        var maxAge = DateTime.Today.AddYears(-userParams.MinAge).ToUniversalTime();

        var query = _context.Users
                        .AsQueryable()
                        .Where(user => user.UserName != userParams.CurrentUsername)
                        .Where(user => user.Gender == userParams.Gender)
                        .Where(user => user.DateOfBirth >= minAge && user.DateOfBirth <= maxAge)
                        .OrderByField(userParams.OrderBy)
                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                        .AsNoTracking();

        return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
    }
    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
                        .Include(user => user.Photos)
                        .SingleOrDefaultAsync(user => user.UserName == username);
    }

    public async Task<string> GetUserGender(string username)
    {
        return await _context.Users
            .Where(u => u.UserName == username)
            .Select(u => u.Gender)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _context.Users
                        .Include(user => user.Photos)
                        .ToListAsync();
    }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }
}