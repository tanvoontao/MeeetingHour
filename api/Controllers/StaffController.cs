using api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Security.Principal;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly DBService _db;
        private readonly IWebHostEnvironment _env;

        public StaffController(DBService db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult<string>> CreateStaff(Staff staff)
        {
            var msg = await _db.CreateStaff(staff);
            if (msg == "ok")
            {
                return Ok("ok");
            }
            else
            {
                return BadRequest(msg);
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<string>> GetStaff(Staff staff)
        {
            Staff staffDB = await _db.StaffLogin(staff);
            if (staffDB.Jwt == "wrong password")
            {
                return BadRequest("wrong password");
            }
            else if (staffDB.Jwt == "student not exist")
            {
                return BadRequest("student not exist");
            }
            else
            {
                return Ok(staffDB);
            }
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<Staff> GetStaff(string id)
        {
            Staff staff = await _db.GetStaff(id);
            staff.ProfileImg = GetProfileImgUrl(staff.ProfileImg);
            return staff;
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateStaff(string id, Staff staff)
        {

            if (staff.ProfileImg != "")
            {
                RemoveProfileImage(_db.GetOldProfImgName(id, "staff"));
            }

            var msg = await _db.UpdateStaff(id, staff);
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
        [HttpPost("UploadProfileImage")]
        public async Task<ActionResult> UploadImage()
        {
            bool results = false;

            try
            {
                IFormCollection httpReuest = Request.Form;
                IFormFileCollection uploadedProfImg = Request.Form.Files;
                foreach (IFormFile source in uploadedProfImg)
                {
                    string fileName = source.FileName;
                    string filePath = _env.WebRootPath + "/Uploads/StaffProfile/" + fileName;

                    using (FileStream stream = new FileStream(filePath, FileMode.Create))
                    {
                        await source.CopyToAsync(stream);
                        results = true;
                    }
                }
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [NonAction]
        public string GetProfileImgUrl(string filename)
        {
            string imgUrl = string.Empty;
            string hostUrl = "https://localhost:7261/";
            string filePath = _env.WebRootPath + "/Uploads/StaffProfile/" + filename;
            if (!System.IO.File.Exists(filePath))
            {
                imgUrl = hostUrl + "Uploads/StaffProfile/profile.png";
            }
            else
            {
                imgUrl = hostUrl + "Uploads/StaffProfile/" + filename;
            }
            return imgUrl;
        }

        [NonAction]
        public async void RemoveProfileImage(string filename)
        {
            string filePath = _env.WebRootPath + "/Uploads/StaffProfile/" + filename;
            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        [Authorize]
        [HttpGet()]
        public async Task<List<Staff>> GetAllStaffs()
        {
            var staffs = await _db.GetAllStaffs();
            foreach (Staff staff in staffs)
            {
                staff.ProfileImg = GetProfileImgUrl(staff.ProfileImg);
            }
            
            return staffs;
        }

        [Authorize]
        [HttpGet("ByName/{keyword}")]
        public async Task<List<Staff>> GetAllStaffsByName(string keyword)
        {
            var staffs = await _db.GetAllStaffsByName(keyword);
            foreach (Staff staff in staffs)
            {
                staff.ProfileImg = GetProfileImgUrl(staff.ProfileImg);
            }

            return staffs;
        }


        [Authorize]
        [HttpDelete("{id}")]
        public void DeleteStaff(string id)
        {
            RemoveProfileImage(_db.GetOldProfImgName(id, "staff"));
            _db.DeleteStaff(id);
        }
    }
}
