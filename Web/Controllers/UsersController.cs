using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Dtos;
using Model.Entities;
using Model.Extensions;
using Model.Params;
using Repository.interfaces;
using Service.Extensions;
using Service.Interface;

namespace Web.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;
    private readonly IUnitOfWork _unitOfWork;

    public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {

        var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUsername());
        userParams.CurrentUsername = User.GetUsername();

        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = gender == "male" ? "female" : "male";
        }

        var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

        return Ok(users);

    }

    [HttpGet("{username}", Name = "GetUser")]
    public async Task<ActionResult<MemberDto>> getSingleUser(string username)
    {
        return await _unitOfWork.UserRepository.GetMemberByUsername(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
    {
        var gender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        _mapper.Map(memberUpdateDto, gender);

        _unitOfWork.UserRepository.Update(gender);
        if (await _unitOfWork.SaveChangesAsync())
        {
            return NoContent();
        };

        return BadRequest("Failed to update gender");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> UploadPhoto(IFormFile file)
    {
        var gender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
        var result = await _photoService.AddPhotoToCloudAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);
        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (gender.Photos.Count == 0)
        {
            photo.IsMain = true;
        }

        gender.Photos.Add(photo);

        if (await _unitOfWork.SaveChangesAsync())
        {
            return CreatedAtRoute("GetUser", new { username = gender.UserName }, _mapper.Map<PhotoDto>(photo));
        }

        return BadRequest("There was a problem uploading the photo");
    }

    [HttpPatch("photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var gender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = gender.Photos.FirstOrDefault(photo => photo.Id == photoId);

        if (photo.IsMain) return BadRequest("Photo is already your main photo");

        var currentMain = gender.Photos.FirstOrDefault(photo => photo.IsMain);

        if (currentMain != null) currentMain.IsMain = false;

        photo.IsMain = true;

        if (await _unitOfWork.SaveChangesAsync()) return NoContent();

        return BadRequest("Something unexpected went wrong, Failed to set main photo.");
    }

    [HttpDelete("photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var gender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = gender.Photos.FirstOrDefault(ph => ph.Id == photoId);

        if (photo == null) return NotFound("Could not find the photo you were looking for");

        if (photo.IsMain) return BadRequest("Can not delete the main photo");

        if (photo != null)
        {
            var result = await _photoService.DeletePhotoFromCloudAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);

        }
        gender.Photos.Remove(photo);

        if (await _unitOfWork.SaveChangesAsync()) return Ok();

        return BadRequest("Failed to delete photo");
    }


}