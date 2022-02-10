using api.DTO;
using api.Dtos;
using api.Entities;
using api.Extensions;
using AutoMapper;

namespace api.helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(
                dest => dest.PhotoUrl,
                opt =>
                    opt.MapFrom(
                        src =>
                            src.Photos
                                .FirstOrDefault(photo => photo.IsMain)
                                .Url
                        )
                )
            .ForMember(
                dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge())
            );

        CreateMap<MemberUpdateDto, AppUser>();

        CreateMap<Photo, PhotoDto>();

        CreateMap<RegisterDto, AppUser>();

        CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.SenderPhotoUrl,
                    opt => opt.MapFrom(src =>
                                    src.Sender.Photos.FirstOrDefault(ph => ph.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl,
                     opt => opt.MapFrom(src =>
                                    src.Recipient.Photos.FirstOrDefault(ph => ph.IsMain).Url));
    }
}