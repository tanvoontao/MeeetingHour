using api.Data;
using MySql.Data.MySqlClient;

namespace api.Dao
{
    public interface IStudentDao
    {
        Task<Student> StudentLogin(MySqlConnection conn, Student student);
        Task<string> AddStudent(MySqlConnection conn, Student student);
        Task<List<Student>> GetStudents(MySqlConnection conn, string keyword);
        Task<Student> GetStudent(MySqlConnection conn, string id);
        Task<string> UpdateStudent(MySqlConnection conn, string id, Student student);
        void DeleteStudent(MySqlConnection conn, string id);
    }

    public class StudentDao : IStudentDao
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonAction _commonAction;

        public StudentDao(IConfiguration configuration, ICommonAction commonAction)
        {
            _configuration = configuration;
            _commonAction = commonAction;
        }

        public async Task<string> AddStudent(MySqlConnection conn, Student student)
        {
            if (IsStdAccExist(conn, student.Email))
            {
                return "Account Exist. Please Login.";
            }

            if (student.Email == "" ||
                student.Password == "" ||
                student.StudentID == ""
                )
            {
                return "Student ID, Email and Password Fields are Required. ";
            }

            student.ID = Guid.NewGuid();
            student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO students (id, student_id, fname, lname, gender, address, profile_img_name, email, password ) 
                                VALUES  (@id, @student_id, @fname, @lname, @gender, @address, @profile_img_name, @email, @password);";

            cmd.Parameters.AddWithValue("@id", student.ID);
            cmd.Parameters.AddWithValue("@student_id", student.StudentID);
            cmd.Parameters.AddWithValue("@fname", student.FirstName);
            cmd.Parameters.AddWithValue("@lname", student.LastName);
            cmd.Parameters.AddWithValue("@gender", student.Gender);
            cmd.Parameters.AddWithValue("@address", student.Address);
            cmd.Parameters.AddWithValue("@profile_img_name", student.ProfileImg);
            cmd.Parameters.AddWithValue("@email", student.Email);
            cmd.Parameters.AddWithValue("@password", student.Password);
            cmd.Prepare();

            try
            {
                await cmd.ExecuteNonQueryAsync();
                return "ok";
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                return ex.ToString();
            }
        }

        public async void DeleteStudent(MySqlConnection conn, string id)
        {
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM students WHERE id=@id";
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Prepare();

            try
            {
                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
            }
        }

        public async Task<Student> GetStudent(MySqlConnection conn, string id)
        {
            Student stdFromDB = new Student();
            stdFromDB.Jwt = "";

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from students where id=@id limit 1";
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (reader.Read())
                    {
                        stdFromDB.ID = reader.GetGuid(0);
                        stdFromDB.StudentID = reader.GetString(1);
                        stdFromDB.FirstName = reader.GetString(2);
                        stdFromDB.LastName = reader.GetString(3);
                        stdFromDB.Gender = reader.GetString(4);
                        stdFromDB.Address = reader.GetString(5);
                        stdFromDB.ProfileImg = reader.GetString(6);
                        stdFromDB.Email = reader.GetString(7);
                        stdFromDB.Password = reader.GetString(8);
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }

            return stdFromDB;
        }

        public async Task<List<Student>> GetStudents(MySqlConnection conn, string keyword)
        {
            var students = new List<Student>();
            var cmd = conn.CreateCommand();

            if (keyword == "")
            {
                cmd.CommandText = "SELECT * FROM students";
            }
            else
            {
                cmd.CommandText = @"select * from students where fname LIKE @keyword or lname LIKE @keyword";
                cmd.Parameters.AddWithValue("@keyword", $"%{keyword}%");
            }
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        students.Add(
                            new Student(
                                reader.GetGuid(0),
                                reader.GetString(1),
                                reader.GetString(7),
                                reader.GetString(8),

                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetString(4),
                                reader.GetString(5),
                                reader.GetString(6)
                            )
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }
            return students;
        }

        public async Task<Student> StudentLogin(MySqlConnection conn, Student student)
        {
            Student studentDB = new Student();
            if (!IsStdAccExist(conn, student.Email))
            {
                studentDB.Jwt = "student not exist";
                return studentDB;
            }

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from students where email=@email limit 1";
            cmd.Parameters.AddWithValue("@email", student.Email);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        studentDB.ID = reader.GetGuid(0);
                        studentDB.Email = reader.GetString(7);
                        studentDB.Password = reader.GetString(8);
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }

            bool isPwCorrect = BCrypt.Net.BCrypt.Verify(student.Password, studentDB.Password);
            if (isPwCorrect)
            {
                studentDB.Password = "";
                studentDB.Jwt = _commonAction.GenerateToken(studentDB.Email);
                return studentDB;
            }
            studentDB.Jwt = "wrong password";
            return studentDB;

        }

        public async Task<string> UpdateStudent(MySqlConnection conn, string id, Student student)
        {
            if (id == "" ||
                student.Email == "" ||
                student.FirstName == "" ||
                student.LastName == "" ||
                student.Gender == "" ||
                student.Address == ""
                )
            {
                return "All Fields Required, except for profile image and password. ";
            }
            string query = @"UPDATE students SET fname=@fname, lname=@lname, gender=@gender, address=@address ";

            if (student.Password != "")
            {
                query += ", password=@password ";
            }
            if (student.ProfileImg != "")
            {
                query += ", profile_img_name=@profile_img_name ";
            }
            if (student.StudentID != "")
            {
                query += ", student_id=@student_id ";
            }
            if (student.Email != "")
            {
                query += ", email=@email ";
            }

            query += "WHERE id = @id";

            var cmd = conn.CreateCommand();
            cmd.CommandText = query;
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Parameters.AddWithValue("@fname", student.FirstName);
            cmd.Parameters.AddWithValue("@lname", student.LastName);
            cmd.Parameters.AddWithValue("@gender", student.Gender);
            cmd.Parameters.AddWithValue("@address", student.Address);

            if (student.Password != "")
            {
                cmd.Parameters.AddWithValue("@password", BCrypt.Net.BCrypt.HashPassword(student.Password));
            }
            if (student.ProfileImg != "")
            {
                cmd.Parameters.AddWithValue("@profile_img_name", student.ProfileImg);
            }
            if (student.StudentID != "")
            {
                cmd.Parameters.AddWithValue("@student_id", student.StudentID);
            }
            if (student.Email != "")
            {
                cmd.Parameters.AddWithValue("@email", student.Email);
            }

            cmd.Prepare();

            try
            {
                await cmd.ExecuteNonQueryAsync();
                return "ok";
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                return ex.ToString();
            }

        }


        public bool IsStdAccExist(MySqlConnection conn, string stdEmail)
        {
            Student stdFromDB = new Student();

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from students where email=@email limit 1";
            cmd.Parameters.AddWithValue("@email", stdEmail);
            cmd.Prepare();

            try
            {
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        stdFromDB.ID = reader.GetGuid(0);
                    }
                }
            }
            catch (Exception ex)
            {
                conn.CloseAsync();
                Console.WriteLine(ex);
            }

            if (stdFromDB.ID != Guid.Empty)
            {
                return true;
            }
            return false;
        }
    }
}
