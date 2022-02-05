using CloudinaryDotNet.Actions;

namespace api.Interface;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoToCloudAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoFromCloudAsync(string publicId);
}