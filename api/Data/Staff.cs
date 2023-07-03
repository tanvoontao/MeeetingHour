namespace api.Data
{
    public class Staff : Account
    {
        public string Biography { get; set; }

        public Staff(Guid id, string email, string password,
                        string fname, string lname, string gender,
                        string biography, string profileImg)
        {
            ID = id;
            Email = email;
            Password = password;

            FirstName = fname;
            LastName = lname;
            Gender = gender;
            Biography = biography;
            ProfileImg = profileImg;
            Jwt = "";
        }

        public Staff() : base()
        {
            Biography = "NaN";
        }
    }
}
