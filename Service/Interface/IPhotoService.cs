using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Service.Interface;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoToCloudAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoFromCloudAsync(string publicId);
}