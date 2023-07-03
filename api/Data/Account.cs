namespace api.Data
{
    public class Account
    {
        public Guid ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string? ProfileImg { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Jwt { get; set; }

        public Account(Guid id, string email, string password,
                        string fname, string lname, string gender,
                        string profileImg)
        {
            ID = id;
            Email = email;
            Password = password;

            FirstName = fname;
            LastName = lname;
            Gender = gender;
            ProfileImg = profileImg;
            Jwt = "";
        }

        public Account()
        {
            ID = Guid.Empty;
            Email = "";
            Password = "";
            FirstName = "NaN";
            LastName = "NaN";
            Gender = "NaN";
            ProfileImg = "";
            Jwt = "";
        }
    }
}
