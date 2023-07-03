using api.Data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UnitController : ControllerBase
    {
        private readonly DBService _db;
        public UnitController(DBService db)
        {
            _db = db;
        }

        // GET - /{course_name}
        [HttpGet("{course_name}")]
        public async Task<List<string>> GetUnits(string course_name)
        {
            return await _db.GetUnits(course_name);
        }

        // GET - /Staff/{unit_code}
        [HttpGet("Staff/{unit_code}")]
        public async Task<List<string>> GetStaffEnrollUnits(string unit_code)
        {
            return await _db.GetStaffEnrollUnits(unit_code);
        }

    }
}
