
namespace Model.Extensions;
public static class DateTimeExtension
{
    public static int CalculateAge(this DateTime dateOfBirth)
    {
        var today = DateTime.Today.ToUniversalTime();
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth.Date > today.AddYears(-age)) --age;
        return age;
    }
}