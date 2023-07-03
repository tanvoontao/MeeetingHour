using api.Dao;
using MySql.Data.MySqlClient;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Data
{
    public class DBService
    {
        private readonly IConfiguration _configuration;
        private readonly MySqlConnection conn;

        private readonly IAdminDao _adminDao;
        private readonly IUnitDao _unitDao;
        private readonly IStaffDao _staffDao;
        private readonly IStudentDao _studentDao;
        private readonly IAppointmentDao _appointmentDao;


        public DBService(IConfiguration configuration, 
                IAdminDao adminDao, IUnitDao unitDao, IStaffDao staffDao,
                IStudentDao studentDao, IAppointmentDao appointmentDao)
        {
            _configuration = configuration;
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            conn = new MySqlConnection(sqlDataSource);


            _adminDao = adminDao;
            _unitDao = unitDao;
            _staffDao = staffDao;
            _studentDao = studentDao;
            _appointmentDao = appointmentDao;

            if (conn.State == ConnectionState.Open)
            {
                conn.CloseAsync();
            }
        }


        // [start] student related
        public async Task<List<Student>> GetAllStudents()
        {
            await conn.OpenAsync();
            var students = await _studentDao.GetStudents(conn, "");
            await conn.CloseAsync();
            return students;
        }
        public async Task<List<Student>> GetAllStudentsByName(string keyword)
        {
            await conn.OpenAsync();
            var students = await _studentDao.GetStudents(conn, keyword);
            await conn.CloseAsync();
            return students;
        }
        public async Task<string> CreateStudent(Student student)
        {
            await conn.OpenAsync();
            var msg = await _studentDao.AddStudent(conn, student);
            await conn.CloseAsync();
            return msg;
        }
        public async void DeleteStudent(string id)
        {
            await conn.OpenAsync();
            _studentDao.DeleteStudent(conn, id);
            await conn.CloseAsync();
        }
        public async Task<Student> GetStudent(string id)
        {
            await conn.OpenAsync();
            var student = await _studentDao.GetStudent(conn, id);
            await conn.CloseAsync();
            return student;
        }
        public async Task<Student> Login(Student student)
        {
            await conn.OpenAsync();
            var studentDB = await _studentDao.StudentLogin(conn, student);
            await conn.CloseAsync();
            return studentDB;
        }
        public async Task<string> UpdateStudent(string id, Student student)
        {
            await conn.OpenAsync();
            var msg = await _studentDao.UpdateStudent(conn, id, student);
            await conn.CloseAsync();
            return msg;
        }
        // [end] student related








        // [start] staff related
        public async Task<string> CreateStaff(Staff staff)
        {
            await conn.OpenAsync();
            var msg = await _staffDao.AddStaff(conn, staff);
            await conn.CloseAsync();
            return msg;
        }
        public async Task<Staff> StaffLogin(Staff staff)
        {
            await conn.OpenAsync();
            var staffDB = await _staffDao.StaffLogin(conn, staff);
            await conn.CloseAsync();
            return staffDB;
        }
        public async Task<List<Staff>> GetAllStaffs()
        {
            await conn.OpenAsync();
            var staffs = await _staffDao.GetStaffs(conn, "");
            await conn.CloseAsync();
            return staffs;
        }
        public async Task<List<Staff>> GetAllStaffsByName(string keyword)
        {
            await conn.OpenAsync();
            var staffs = await _staffDao.GetStaffs(conn, keyword);
            await conn.CloseAsync();
            return staffs;
        }
        public async Task<Staff> GetStaff(string id)
        {
            await conn.OpenAsync();
            var staff = await _staffDao.GetStaff(conn, id);
            await conn.CloseAsync();
            return staff;
        }
        public async Task<string> UpdateStaff(string id, Staff staff)
        {
            await conn.OpenAsync();
            var msg = await _staffDao.UpdateStaff(conn, id, staff);
            await conn.CloseAsync();
            return msg;
        }
        public async void DeleteStaff(string id)
        {
            await conn.OpenAsync();
            _staffDao.DeleteStaff(conn, id);
            await conn.CloseAsync();
        }
        // [end] staff related


        //Task<List<string>>
        public async Task<List<string>> test()
        {
            var list = new List<string>();
            list.Add("aa");
            list.Add("bb");
            

            return list; 
        }




        // [start] appointment related 
        public async Task<string> CreateAppointment(Appointment appointment)
        {
            await conn.OpenAsync();
            var msg = await _appointmentDao.AddAppointment(conn, appointment);
            await conn.CloseAsync();
            return msg;
        }
        public async Task<Appointment?> GetAppointment(string id)
        {
            await conn.OpenAsync();
            var appointment = await _appointmentDao.GetAppointment(conn, id);
            await conn.CloseAsync();
            return appointment;
        }
        public async Task<List<Appointment>> GetAppointmentFromStudent(string student_id, string type)
        {
            await conn.OpenAsync();
            var appointment = await _appointmentDao.GetAppointmentsFrom(conn, "student", type, student_id);
            await conn.CloseAsync();
            return appointment;
        }
        public async Task<List<Appointment>> GetAppointmentFromStaff(string staff_id, string type)
        {
            await conn.OpenAsync();
            var appointment = await _appointmentDao.GetAppointmentsFrom(conn, "staff", type, staff_id);
            await conn.CloseAsync();
            return appointment;
        }
        public async void EditAppointment(string id, string action)
        {
            await conn.OpenAsync();
             _appointmentDao.UpdateAppointment(conn, id, action);
            await conn.CloseAsync();
        }
        public async Task<List<Appointment>> GetAppointmentsOn(string date, string staff_email)
        {
            await conn.OpenAsync();
            var appointments = await _appointmentDao.GetAppointmentsOn(conn, date, staff_email);
            await conn.CloseAsync();
            return appointments;
        }
        // [end] appointment related 









        // [start] admin related
        public async Task<Admin> AdminLogin(Admin admin)
        {
            await conn.OpenAsync();
            var adminFromDB = await _adminDao.AdminLogin(conn, admin);
            await conn.CloseAsync();
            return adminFromDB;
        }
        public async Task<string> AddAdmin(Admin admin)
        {
            await conn.OpenAsync();
            var msg = await _adminDao.AddAdmin(conn, admin);
            await conn.CloseAsync();
            return msg;
        }
        // [end] admin related






        // [start] units related 
        public async Task<List<String>> GetUnits(string course_name)
        {
            await conn.OpenAsync();
            var units = await _unitDao.GetUnits(conn, course_name);
            await conn.CloseAsync();
            return units;
        }
        public async Task<List<String>> GetStaffEnrollUnits(string unit_code)
        {
            await conn.OpenAsync();
            var staffs = await _unitDao.GetStaffEnrollUnits(conn, unit_code);
            await conn.CloseAsync();
            return staffs;
        }
        // [end] units related 




        // GetOldProfImgName
        public string GetOldProfImgName(string id, string account)
        {
            string query = "";
            if (account == "staff")
            {
                query = @"select profile_img_name from staffs where id=@id limit 1 ";
            }
            else if (account == "student")
            {
                query = @"select profile_img_name from students where id=@id limit 1 ";
            }

            string filename = "";
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = query;
            cmd.Parameters.AddWithValue("@id", id);
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    filename = reader.GetString(0);
                }
            }
            conn.Close();
            return filename;
        }







        // useless methods - for future references
        public string GetEmail(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "email").Value;
            return email;
        }
        public long GetTokenExpirationTime(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var tokenExp = jwtSecurityToken.Claims.First(claim => claim.Type.Equals("exp")).Value;
            var ticks = long.Parse(tokenExp);
            return ticks;
        }
        public bool ISTokenIsValid(string token)
        {
            var tokenTicks = GetTokenExpirationTime(token);
            var tokenDate = DateTimeOffset.FromUnixTimeSeconds(tokenTicks).UtcDateTime;

            var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));

            var valid = tokenDate >= now;

            return valid;
        }
        // useless methods [end]
        

    }
}

