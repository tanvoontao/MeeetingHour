using System.Reflection;

namespace api.Data
{
    public class Admin
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Jwt { get; set; }


        public Admin(Guid id, string name, string email, string password)
        {
            ID = id;
            Email = email;
            Password = password;
            Name = name;
            Jwt = "";
        }

        public Admin()
        {
            ID = Guid.Empty;
            Email = "";
            Password = "";
            Name = "NaN";
            Jwt = "";
        }
    }
}
