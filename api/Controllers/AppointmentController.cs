using api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly DBService _db;
        public AppointmentController(DBService db)
        {
            _db = db;
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<string>> CreateAppointment(Appointment appointment)
        {
            var msg = await _db.CreateAppointment(appointment);
            if (msg == "ok")
            {
                return Ok("ok");
            }
            else
            {
                return BadRequest(msg);
            }
        }

        [Authorize]
        [HttpGet("/Student/UpComing/{student_id}")]
        public async Task<List<Appointment>> GetUpComingAppointmentFromStudents(string student_id)
        {
            return await _db.GetAppointmentFromStudent(student_id, "upcoming");
        }

        [Authorize]
        [HttpGet("/Student/Pending/{student_id}")]
        public async Task<List<Appointment>> GetPendingAppointmentFromStudents(string student_id)
        {
            return await _db.GetAppointmentFromStudent(student_id, "pending");
        }

        [Authorize]
        [HttpGet("/Student/History/{student_id}")]
        public async Task<List<Appointment>> GetHistoryAppointmentFromStudents(string student_id)
        {
            return await _db.GetAppointmentFromStudent(student_id, "history");
        }

        [Authorize]
        [HttpGet("/Time/{date}/{staff_email}")]
        public async Task<List<Appointment>> GetAppointmentTime(string date, string staff_email)
        {
            return await _db.GetAppointmentsOn(date, staff_email);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<Appointment> GetAppointment(string id)
        {
            return await _db.GetAppointment(id);
        }

        [Authorize]
        [HttpGet("Cancel/{id}")]
        public async void CancelAppointment(string id)
        {
            _db.EditAppointment(id, "cancel");
        }

        [Authorize]
        [HttpGet("Approve/{id}")]
        public async void ApproveAppointment(string id)
        {
            _db.EditAppointment(id, "approve");
        }

        [Authorize]
        [HttpGet("Complete/{id}")]
        public async void CompleteAppointment(string id)
        {
            _db.EditAppointment(id, "complete");
        }



        [Authorize]
        [HttpGet("/Staff/UpComing/{staff_id}")]
        public async Task<List<Appointment>> GetUpComingAppointmentFromStaff(string staff_id)
        {
            return await _db.GetAppointmentFromStaff(staff_id, "upcoming");
        }

        [Authorize]
        [HttpGet("/Staff/History/{staff_id}")]
        public async Task<List<Appointment>> GetHistoryAppointmentFromStaff(string staff_id)
        {
            return await _db.GetAppointmentFromStaff(staff_id, "history");
        }
    }
}
