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

        CreateMap<Photo, PhotoDto>();
    }
}