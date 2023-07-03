using api.Data;
using MySql.Data.MySqlClient;


namespace api.Dao
{
    public interface IAdminDao
    {
        Task<Admin> AdminLogin(MySqlConnection conn, Admin admin);
        Task<string> AddAdmin(MySqlConnection conn, Admin admin);
    }

    public class AdminDao : IAdminDao
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonAction _commonAction;

        public AdminDao(IConfiguration configuration, ICommonAction commonAction)
        {
            _configuration = configuration;
            _commonAction = commonAction;
        }

        public async Task<Admin> AdminLogin(MySqlConnection conn, Admin admin)
        {
            Admin adminFromDB = new Admin();
            adminFromDB.Jwt = "";

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from admins where email=@email limit 1";
            cmd.Parameters.AddWithValue("@email", admin.Email);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        adminFromDB.ID = reader.GetGuid(0);
                        adminFromDB.Name = reader.GetString(1);
                        adminFromDB.Email = reader.GetString(2);
                        adminFromDB.Password = reader.GetString(3);
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }

            if (adminFromDB.ID != Guid.Empty)
            {
                bool isPwCorrect = BCrypt.Net.BCrypt.Verify(admin.Password, adminFromDB.Password);
                if (isPwCorrect)
                {
                    adminFromDB.Password = "";
                    adminFromDB.Jwt = _commonAction.GenerateToken(adminFromDB.Email);
                }
                else
                {
                    adminFromDB.Jwt = "wrong password";
                }
            }
            else
            {
                adminFromDB.Jwt = "admin not exist";
            }
            return adminFromDB;
        }

        public async Task<string> AddAdmin(MySqlConnection conn, Admin admin)
        {

            if (admin.Name == "" || admin.Password == "" || admin.Email == "")
            {
                return "Name, Email and Password Fields are Required. ";
            }

            admin.ID = Guid.NewGuid();
            admin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO admins (id, name, email, password) 
                                VALUES  (@id, @name, @email, @password);";

            cmd.Parameters.AddWithValue("@id", admin.ID);
            cmd.Parameters.AddWithValue("@name", admin.Name);
            cmd.Parameters.AddWithValue("@email", admin.Email);
            cmd.Parameters.AddWithValue("@password", admin.Password);
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
    }
}
