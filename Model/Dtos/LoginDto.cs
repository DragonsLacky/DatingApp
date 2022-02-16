using System.ComponentModel.DataAnnotations;

namespace Model.Dtos;

public class LoginDto
{
    [Required]
    public string userName { get; set; }

    [Required]
    public string Password { get; set; }
}