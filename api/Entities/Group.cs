using System.ComponentModel.DataAnnotations;

namespace api.Entities;

public class Group
{
    public Group()
    {
    }

    public Group(string name)
    {
        Name = name;
    }

    [Key]
    public string Name { get; set; }

    public virtual ICollection<Connection> Connections { get; set; } = new List<Connection>();

}