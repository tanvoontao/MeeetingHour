using api.Data;
using MySql.Data.MySqlClient;
using System.Reflection.PortableExecutable;

namespace api.Dao
{
    public interface IAppointmentDao
    {
        Task<string> AddAppointment(MySqlConnection conn, Appointment appointment);
        Task<Appointment> GetAppointment(MySqlConnection conn, string id);
        Task<List<Appointment>> GetAppointmentsFrom(MySqlConnection conn, string account, string type, string id);
        void UpdateAppointment(MySqlConnection conn, string id, string action);
        Task<List<Appointment>> GetAppointmentsOn(MySqlConnection conn, string date, string staff_email);
    }

    public class AppointmentDao:IAppointmentDao
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonAction _commonAction;

        public AppointmentDao(IConfiguration configuration, ICommonAction commonAction)
        {
            _configuration = configuration;
            _commonAction = commonAction;
        }

        public async Task<string> AddAppointment(MySqlConnection conn, Appointment appointment)
        {
            appointment.ID = Guid.NewGuid();
            string query = "";

            if (appointment.Staff_email != "" || appointment.Staff_email != null)
            {
                // if and only if only staff email pass in without staff_id
                // construct a query than can find out the staff_id based on email pass in
                query = @"INSERT INTO appointments (id, staff_id, student_id, datetime, approve, pending, complete, cancel, cancel_reason, note) 
                                VALUES            (@id, (select id from staffs where email=@staff_email), @student_id, @datetime, @approve, @pending, @complete, @cancel, @cancel_reason, @note);";
            }
            else
            {
                query = @"INSERT INTO appointments (id, staff_id, student_id, datetime, approve, pending, complete, cancel, cancel_reason, note) 
                                VALUES            (@id, @staff_id, @student_id, @datetime, @approve, @pending, @complete, @cancel, @cancel_reason, @note);";
            }

            var cmd = conn.CreateCommand();
            cmd.CommandText = query;
            cmd.Parameters.AddWithValue("@id", appointment.ID);

            if (appointment.Staff_email != "" || appointment.Staff_email != null)
            {
                cmd.Parameters.AddWithValue("@staff_email", appointment.Staff_email);
            }
            else
            {
                cmd.Parameters.AddWithValue("@staff_id", appointment.Staff_id);
            }

            cmd.Parameters.AddWithValue("@student_id", appointment.Student_id);
            cmd.Parameters.AddWithValue("@datetime", appointment.DateTime);
            cmd.Parameters.AddWithValue("@approve", appointment.Approve);
            cmd.Parameters.AddWithValue("@pending", appointment.Pending);
            cmd.Parameters.AddWithValue("@complete", appointment.Complete);
            cmd.Parameters.AddWithValue("@cancel", appointment.Cancel);
            cmd.Parameters.AddWithValue("@cancel_reason", (appointment.Cancel_reason == null) ? "" : appointment.Cancel_reason);
            cmd.Parameters.AddWithValue("@note", (appointment.Note == null) ? "" : appointment.Note);
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

        public async Task<Appointment> GetAppointment(MySqlConnection conn, string id)
        {
            Appointment appointment = new Appointment();
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"select appointments.*, staffs.email, students.email from appointments 
                            join staffs on staffs.id=appointments.staff_id 
                            join students on students.id=appointments.student_id 
                            where appointments.id=@id limit 1";
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        appointment.ID = reader.GetGuid(0);
                        appointment.Staff_id = reader.GetString(1);
                        appointment.Student_id = reader.GetString(2);
                        appointment.DateTime = reader.GetString(3);
                        appointment.Approve = reader.GetBoolean(4);
                        appointment.Pending = reader.GetBoolean(5);
                        appointment.Complete = reader.GetBoolean(6);
                        appointment.Cancel = reader.GetBoolean(7);
                        appointment.Cancel_reason = reader.GetString(8);
                        appointment.Note = reader.GetString(9);
                        appointment.Staff_email = reader.GetString(10);
                        appointment.Student_email = reader.GetString(11);
                    }
                }
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }
            return appointment;
        }

        public async Task<List<Appointment>> GetAppointmentsFrom(MySqlConnection conn, string account, string type, string id)
        {
            var appointments = new List<Appointment>();

            var cmd = conn.CreateCommand();
            string query = "";

            if (account == "student")
            {
                if (type == "upcoming")
                {
                    query = @"select appointments.*, staffs.email from appointments 
                        join staffs on staffs.id=appointments.staff_id 
                        where student_id=@student_id and datetime > NOW() and approve=1 and pending=1 and complete=0";
                }
                else if (type == "pending")
                {
                    query = @"select appointments.*, staffs.email from appointments 
                        join staffs on staffs.id=appointments.staff_id 
                        where student_id=@student_id and datetime > NOW() and approve=0 and pending=1";
                }
                else if (type == "history")
                {
                    query = @"select appointments.*, staffs.email from appointments 
                        join staffs on staffs.id=appointments.staff_id
                        where student_id=@student_id and datetime < NOW() 
                        UNION
                        select appointments.*, staffs.email from appointments 
                        join staffs on staffs.id=appointments.staff_id
                        where student_id=@student_id and cancel=1
                        UNION
                        select appointments.*, staffs.email from appointments 
                        join staffs on staffs.id=appointments.staff_id
                        where student_id=@student_id and complete=1";
                }
            }
            else if (account == "staff")
            {
                if (type == "upcoming")
                {
                    query = @"select appointments.*, students.email from appointments 
                        join students on students.id=appointments.student_id 
                        where staff_id=@staff_id and datetime > NOW() and pending=1 and complete=0";
                }
                else if (type == "history")
                {
                    query = @"select appointments.*, students.email from appointments 
                        join students on students.id=appointments.student_id 
                        where staff_id=@staff_id and datetime < NOW() or cancel=1 or complete=1";
                }
            }

            cmd.CommandText = query;

            if (account == "student")
            {
                cmd.Parameters.AddWithValue("@student_id", id);
            }
            else if (account == "staff")
            {
                cmd.Parameters.AddWithValue("@staff_id", id);
            }

            cmd.Prepare();

            try
            {
                
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {

                        appointments.Add(
                            new Appointment(
                                reader.GetGuid(0),
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetBoolean(4),
                                reader.GetBoolean(5),
                                reader.GetBoolean(6),
                                reader.GetBoolean(7),
                                reader.GetString(8),
                                reader.GetString(9),
                                (account == "student") ? reader.GetString(10) : "",
                                (account == "staff") ? reader.GetString(10) : ""
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
            return appointments;

        }

        public async Task<List<Appointment>> GetAppointmentsOn(MySqlConnection conn, string date, string staff_email)
        {
            var appointments = new List<Appointment>();

            var cmd = conn.CreateCommand();


            cmd.CommandText = @"select appointments.* from appointments 
                            join staffs on staffs.id=appointments.staff_id
                            where datetime>=@datetime and datetime<=@datetime2 and staffs.email=@staff_email";
            cmd.Parameters.AddWithValue("@datetime", date + " 00:00:00");
            cmd.Parameters.AddWithValue("@datetime2", date + " 23:00:00");
            cmd.Parameters.AddWithValue("@staff_email", staff_email);
            cmd.Prepare();

            try
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        appointments.Add(
                            new Appointment(
                                reader.GetGuid(0),
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetBoolean(4),
                                reader.GetBoolean(5),
                                reader.GetBoolean(6),
                                reader.GetBoolean(7),
                                reader.GetString(8),
                                reader.GetString(9),
                                staff_email,
                                ""
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
            return appointments;
        }

        public async void UpdateAppointment(MySqlConnection conn, string id, string action)
        {
            string query = "";
            if (action == "cancel")
            {
                query = @"UPDATE appointments SET approve=0, pending = 0, complete=0, cancel = 1  WHERE id = @id";
            }
            else if (action == "approve")
            {
                query = @"UPDATE appointments SET approve=1, pending = 1, complete=0, cancel = 0  WHERE id = @id";
            }
            else if (action == "complete")
            {
                query = @"UPDATE appointments SET approve=1, pending = 1, complete=1, cancel = 0  WHERE id = @id";
            }

            var cmd = conn.CreateCommand();
            cmd.CommandText = query;
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Prepare();

            try
            {
                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                await conn.CloseAsync();
                Console.WriteLine(ex);
            }
        }


    }
}
