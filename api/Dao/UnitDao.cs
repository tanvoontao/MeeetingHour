using MySql.Data.MySqlClient;
using api.Data;

namespace api.Dao
{
    public interface IUnitDao
    {
        Task<List<String>> GetUnits(MySqlConnection conn, string course_name);
        Task<List<String>> GetStaffEnrollUnits(MySqlConnection conn, string unit_code);
    }

    public class UnitDao : IUnitDao
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonAction _commonAction;

        public UnitDao(IConfiguration configuration, ICommonAction commonAction)
        {
            _configuration = configuration;
            _commonAction = commonAction;
        }

        public async Task<List<string>> GetStaffEnrollUnits(MySqlConnection conn, string unit_code)
        {
            var staffs = new List<string>();

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select staffs.email from staff_enroll_units 
                                join staffs on staffs.id=staff_enroll_units.staff_id 
                                where code=@code";
            cmd.Parameters.AddWithValue("@code", unit_code);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        staffs.Add(
                            reader.GetString(0)
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

        public async Task<List<string>> GetUnits(MySqlConnection conn, string course_name)
        {
            var units = new List<string>();

            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select * from units where course_name=@course_name";
            cmd.Parameters.AddWithValue("@course_name", course_name);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        units.Add(
                            reader.GetString(0) + " " + reader.GetString(1)
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }
            return units;
        }
    }
}
