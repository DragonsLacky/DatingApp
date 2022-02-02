using System.ComponentModel.DataAnnotations;

namespace api.DTO;

public class RegisterDto
{
    [Required]
    public string? userName { get; set; }

    [Required]
    [StringLength(8, MinimumLength = 4)]
    public string? Password { get; set; }
}