using AutoMapper;
using Model.Dtos;
using Model.Entities;
using Model.Extensions;

namespace Service.Helpers;

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

        CreateMap<DateTime, DateTime>().ConvertUsing(dateTime => DateTime.SpecifyKind(dateTime, DateTimeKind.Utc));
    }
}