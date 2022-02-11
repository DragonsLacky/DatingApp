using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public class LoginDto
{
    [Required]
    public string userName { get; set; }

    [Required]
    public string Password { get; set; }
}