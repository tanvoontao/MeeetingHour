using api.Data;
using MySql.Data.MySqlClient;

namespace api.Dao
{
    public interface IStaffDao
    {
        Task<Staff> StaffLogin(MySqlConnection conn, Staff staff);
        Task<string> AddStaff(MySqlConnection conn, Staff staff);
        Task<List<Staff>> GetStaffs(MySqlConnection conn, string keyword);
        Task<Staff> GetStaff(MySqlConnection conn, string id);
        Task<string> UpdateStaff(MySqlConnection conn, string id, Staff staff);
        void DeleteStaff(MySqlConnection conn, string id);
    }

    public class StaffDao : IStaffDao
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonAction _commonAction;

        public StaffDao(IConfiguration configuration, ICommonAction commonAction)
        {
            _configuration = configuration;
            _commonAction = commonAction;
        }

        public async Task<string> AddStaff(MySqlConnection conn, Staff staff)
        {
            if (IsStaffAccExist(conn, staff.Email))
            {
                return "Account Already Exist. ";
            }

            if (staff.Email == "" ||
                staff.Password == "" ||
                staff.FirstName == "" ||
                staff.LastName == "" ||
                staff.Gender == "" ||
                staff.Biography == ""
                )
            {
                return "All Fields Required, except for profile image. ";
            }

            staff.ID = Guid.NewGuid();
            staff.Password = BCrypt.Net.BCrypt.HashPassword(staff.Password);

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"insert into staffs (id, email, password, fname, lname, gender, biography, profile_img_name) 
                                VALUES              (@id, @email, @password, @fname, @lname, @gender, @biography, @profile_img_name);";

            cmd.Parameters.AddWithValue("@id", staff.ID);
            cmd.Parameters.AddWithValue("@email", staff.Email);
            cmd.Parameters.AddWithValue("@password", staff.Password);
            cmd.Parameters.AddWithValue("@fname", staff.FirstName);
            cmd.Parameters.AddWithValue("@lname", staff.LastName);
            cmd.Parameters.AddWithValue("@gender", staff.Gender);
            cmd.Parameters.AddWithValue("@biography", staff.Biography);
            cmd.Parameters.AddWithValue("@profile_img_name", staff.ProfileImg);
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

        public async Task<Staff> StaffLogin(MySqlConnection conn, Staff staff)
        {
            Staff staffDB = new Staff();
            staffDB.Jwt = "";

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from staffs where email=@email limit 1";
            cmd.Parameters.AddWithValue("@email", staff.Email);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        staffDB.ID = reader.GetGuid(0);
                        staffDB.Email = reader.GetString(1);
                        staffDB.Password = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }

            if (staffDB.ID != Guid.Empty)
            {
                bool isPwCorrect = BCrypt.Net.BCrypt.Verify(staff.Password, staffDB.Password);
                if (isPwCorrect)
                {
                    staffDB.Password = "";
                    staffDB.Jwt = _commonAction.GenerateToken(staffDB.Email);
                }
                else 
                {
                    staffDB.Jwt = "wrong password";
                }
            }
            else
            {
                staffDB.Jwt = "staff not exist";
            }
            return staffDB;
        }

        public async Task<List<Staff>> GetStaffs(MySqlConnection conn, string keyword)
        {
            var staffs = new List<Staff>();

            var cmd = conn.CreateCommand();

            if (keyword == "")
            {
                cmd.CommandText = "SELECT * FROM staffs";
            }
            else
            {
                cmd.CommandText = @"select * from staffs where fname LIKE @keyword or lname LIKE @keyword";
                cmd.Parameters.AddWithValue("@keyword", $"%{keyword}%");
            }
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        staffs.Add(
                            new Staff(
                                reader.GetGuid(0),
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetString(4),
                                reader.GetString(5),
                                reader.GetString(6),
                                reader.GetString(7)
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
            return staffs;

        }

        public async Task<Staff> GetStaff(MySqlConnection conn, string id)
        {
            Staff staffFromDB = new Staff();

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from staffs where id=@id limit 1";
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (reader.Read())
                    {
                        staffFromDB.ID = reader.GetGuid(0);
                        staffFromDB.Email = reader.GetString(1);
                        staffFromDB.Password = reader.GetString(2);

                        staffFromDB.FirstName = reader.GetString(3);
                        staffFromDB.LastName = reader.GetString(4);
                        staffFromDB.Gender = reader.GetString(5);
                        staffFromDB.Biography = reader.GetString(6);
                        staffFromDB.ProfileImg = reader.GetString(7);

                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }
            return staffFromDB;
        }




        public bool IsStaffAccExist(MySqlConnection conn, string staffEmail)
        {
            Staff staffFromDB = new Staff();

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from staffs where email=@email limit 1";
            cmd.Parameters.AddWithValue("@email", staffEmail);
            cmd.Prepare();

            try
            {
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        staffFromDB.ID = reader.GetGuid(0);
                    }
                }
            }
            catch (Exception ex)
            {
                conn.CloseAsync();
                Console.WriteLine(ex);
            }

            if (staffFromDB.ID != Guid.Empty)
            {
                return true;
            }
            return false;
        }

        public async Task<string> UpdateStaff(MySqlConnection conn, string id, Staff staff)
        {
            if (id == "" ||
                staff.Email == "" ||
                staff.FirstName == "" ||
                staff.LastName == "" ||
                staff.Gender == "" ||
                staff.Biography == ""
                )
            {
                return "All Fields Required, except for profile image and password. ";
            }
            string query = @"UPDATE staffs SET fname=@fname, lname=@lname, gender=@gender, biography=@biography ";
            if (staff.Password != "")
            {
                query += ", password=@password ";
            }
            if (staff.ProfileImg != "")
            {
                query += ", profile_img_name=@profile_img_name ";
            }

            if (staff.Email != "")
            {
                query += ", email=@email ";
            }

            query += "WHERE id = @id";


            var cmd = conn.CreateCommand();
            cmd.CommandText = query;
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Parameters.AddWithValue("@fname", staff.FirstName);
            cmd.Parameters.AddWithValue("@lname", staff.LastName);
            cmd.Parameters.AddWithValue("@gender", staff.Gender);
            cmd.Parameters.AddWithValue("@biography", staff.Biography);

            if (staff.Password != "")
            {
                cmd.Parameters.AddWithValue("@password", BCrypt.Net.BCrypt.HashPassword(staff.Password));
            }

            if (staff.ProfileImg != "")
            {
                cmd.Parameters.AddWithValue("@profile_img_name", staff.ProfileImg);
            }
            if (staff.Email != "")
            {
                cmd.Parameters.AddWithValue("@email", staff.Email);
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

        public async void DeleteStaff(MySqlConnection conn, string id)
        {
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM staffs WHERE id=@id";
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
    }
}
