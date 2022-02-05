using System.Security.Claims;
using api.Dtos;
using api.repository.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> getUsers()
    {
        return Ok(await _userRepository.GetMembersAsync());
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> getSingleUser(string username)
    {
        return await _userRepository.GetMemberByUsername(username);
    }

    [HttpPut]
    public async Task<ActionResult> updateMember(MemberUpdateDto memberUpdateDto)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var user = await _userRepository.GetUserByUsernameAsync(username);

        _mapper.Map(memberUpdateDto, user);

        _userRepository.Update(user);
        if (await _userRepository.SaveAllAsync())
        {
            return NoContent();
        };

        return BadRequest("Failed to update user");
    }
}