using api.Dtos;
using api.Entities;
using api.Extensions;
using api.helpers;
using api.Interface;
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
    private readonly IPhotoService _photoService;

    public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {

        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        userParams.CurrentUsername = user.UserName;

        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = user.Gender == "male" ? "female" : "male";
        }

        var users = await _userRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

        return Ok(users);

    }

    [HttpGet("{username}", Name = "GetUser")]
    public async Task<ActionResult<MemberDto>> getSingleUser(string username)
    {
        return await _userRepository.GetMemberByUsername(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        _mapper.Map(memberUpdateDto, user);

        _userRepository.Update(user);
        if (await _userRepository.SaveAllAsync())
        {
            return NoContent();
        };

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> UploadPhoto(IFormFile file)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        var result = await _photoService.AddPhotoToCloudAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);
        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count == 0)
        {
            photo.IsMain = true;
        }

        user.Photos.Add(photo);

        if (await _userRepository.SaveAllAsync())
        {
            return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
        }

        return BadRequest("There was a problem uploading the photo");
    }

    [HttpPatch("photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

        if (photo.IsMain) return BadRequest("Photo is already your main photo");

        var currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain);

        if (currentMain != null) currentMain.IsMain = false;

        photo.IsMain = true;

        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Something unexpected went wrong, Failed to set main photo.");
    }

    [HttpDelete("photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = user.Photos.FirstOrDefault(ph => ph.Id == photoId);

        if (photo == null) return NotFound("Could not find the photo you were looking for");

        if (photo.IsMain) return BadRequest("Can not delete the main photo");

        if (photo != null)
        {
            var result = await _photoService.DeletePhotoFromCloudAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);

        }
        user.Photos.Remove(photo);

        if (await _userRepository.SaveAllAsync()) return Ok();

        return BadRequest("Failed to delete photo");
    }


}