using api.Data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DBService _db;

        public AdminController(DBService db)
        {
            _db = db;
        }

        // POST - /Admin/Login
        [HttpPost("Login")]
        public async Task<ActionResult<string>> GetAdmin(Admin admin)
        {
            Admin adminFromDB = await _db.AdminLogin(admin);
            if (adminFromDB.Jwt == "wrong password")
            {
                return BadRequest("wrong password");
            }
            else if (adminFromDB.Jwt == "admin not exist")
            {
                return BadRequest("admin not exist");
            }
            else
            {
                return Ok(adminFromDB);
            }
        }

        // POST - /Admin
        [HttpPost()]
        public async Task<ActionResult<string>> AddAdmin(Admin admin)
        {
            var msg = await _db.AddAdmin(admin);
            if (msg == "ok")
            {
                return Ok("ok");
            }
            else
            {
                return BadRequest(msg);
            }
        }
        
    }
}
