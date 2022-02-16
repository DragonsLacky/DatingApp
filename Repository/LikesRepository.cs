using System.Linq;
using Microsoft.EntityFrameworkCore;
using Model.Dtos;
using Model.Entities;
using Model.Extensions;
using Model.Params;
using Repository.interfaces;

namespace Repository;
public class LikesRepository : ILikesRepository
{
    private readonly DataContext _context;
    public LikesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
    {
        return await _context.Likes.FindAsync(sourceUserId, likedUserId);
    }

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
        var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        users = likesParams.Predicate switch
        {
            "likedBy" => likes.Where(like => like.LikedUserId == likesParams.UserId)
                                .Select(like => like.SourceUser),
            _ => likes.Where(like => like.SourceUserId == likesParams.UserId)
                                .Select(like => like.LikedUser)
        };

        var likedUsers = users.Select(user => new LikeDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(ph => ph.IsMain).Url,
            City = user.City,
            Id = user.Id
        });

        return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
        return await _context.Users
                        .Include(user => user.Liked)
                        .FirstOrDefaultAsync(user => user.Id == userId);


    }
}