using static System.Net.Mime.MediaTypeNames;
using System.Drawing;
using System.Xml.Linq;
using System.Reflection;

namespace api.Data
{
    public class Student : Account
    {
        public string StudentID { get; set; }
        public string Address { get; set; }

        public Student(Guid id, string studenId, string email, string password, 
                        string fname, string lname, string gender, 
                        string address, string profileImg)
        {
            ID = id;
            Email = email;
            Password = password;

            StudentID = studenId;
            FirstName = fname;
            LastName = lname;
            Gender = gender;
            Address = address;
            ProfileImg = profileImg;
            Jwt = "";
        }

        public Student() : base()
        {
            StudentID = "";
            Address = "NaN";
        }
    }
}

