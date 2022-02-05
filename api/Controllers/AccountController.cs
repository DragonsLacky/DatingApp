using System.Security.Cryptography;
using System.Text;
using api.data;
using api.DTO;
using api.Dtos;
using api.Entities;
using api.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;


public class AccountController : BaseApiController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;

    public AccountController(DataContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.userName)) return BadRequest("Username is already taken");

        using var hmac = new HMACSHA512();
        var user = new AppUser
        {
            UserName = registerDto.userName.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> login(LoginDto loginDto)
    {
        var user = await _context.Users
                            .Include(user => user.Photos)
                            .SingleOrDefaultAsync(user => user.UserName == loginDto.userName.ToLower());

        if (user == null) return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int hashCharIndex = 0; hashCharIndex < computedHash.Length; hashCharIndex++)
        {
            if (computedHash[hashCharIndex] != user.PasswordHash[hashCharIndex]) return Unauthorized("Invalid Password");
        }

        return new UserDto
        {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url
        };
    }

    private async Task<Boolean> UserExists(string username)
    {
        return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
    }
}