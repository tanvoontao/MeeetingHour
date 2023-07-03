using api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Intrinsics.Arm;
using System.Security.Claims;
using System.Text;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly DBService _db;
        private readonly IWebHostEnvironment _env;

        public StudentController(DBService db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // insert new student
        [HttpPost()]
        public async Task<ActionResult<string>> CreateStudent(Student student)
        {
            var msg = await _db.CreateStudent(student);
            if(msg == "ok")
            {
                return Ok("ok");
            }
            else
            {
                return BadRequest(msg);
            }
            
        }

        // student login
        [HttpPost("Login")]
        public async Task<ActionResult<string>> GetStudent(Student student)
        {
            Student studentDB = await _db.Login(student);
            if(studentDB.Jwt == "wrong password")
            {
                return BadRequest("wrong password");
            }
            else if(studentDB.Jwt == "student not exist")
            {
                return BadRequest("student not exist");
            }
            else
            {
                return Ok(studentDB);
            }
        }

        // get student detail
        [Authorize]
        [HttpGet("{id}")]
        public async Task<Student> GetStudent(string id)
        {
            Student student = await _db.GetStudent(id);
            student.ProfileImg = GetProfileImgUrl(student.ProfileImg);
            return student;
        }

        // update student
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateStudent(string id, Student student)
        {
            if (student.ProfileImg != "")
            {
                RemoveProfileImage(_db.GetOldProfImgName(id, "student"));
            }

            var msg = await _db.UpdateStudent(id, student);
            if (msg == "ok")
            {
                return Ok("ok");
            }
            else
            {
                return BadRequest(msg);
            }

        }

        // delete one student
        [Authorize]
        [HttpDelete("{id}")]
        public void DeleteStudent(string id)
        {
            RemoveProfileImage(_db.GetOldProfImgName(id, "student"));
            _db.DeleteStudent(id);
        }

        // get all students
        [Authorize]
        [HttpGet()]
        public async Task<List<Student>> GetAllStudents()
        {
            var students = await _db.GetAllStudents();
            foreach (Student student in students)
            {
                student.ProfileImg = GetProfileImgUrl(student.ProfileImg);
            }

            return students;
        }

        [Authorize]
        [HttpGet("ByName/{keyword}")]
        public async Task<List<Student>> GetAllStudentsByName(string keyword)
        {
            var students = await _db.GetAllStudentsByName(keyword);
            foreach (Student student in students)
            {
                student.ProfileImg = GetProfileImgUrl(student.ProfileImg);
            }

            return students;
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
                    string filePath = _env.WebRootPath + "/Uploads/StudentProfile/" + fileName;

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
        public async void RemoveProfileImage(string filename)
        {
            string filePath = _env.WebRootPath + "/Uploads/StudentProfile/" + filename;
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

        [NonAction]
        public string GetProfileImgUrl(string filename)
        {
            string imgUrl = string.Empty;
            string hostUrl = "https://localhost:7261/";
            string filePath = _env.WebRootPath + "/Uploads/StudentProfile/" + filename;
            if (!System.IO.File.Exists(filePath))
            {
                imgUrl = hostUrl + "Uploads/StudentProfile/profile.png";
            }
            else
            {
                imgUrl = hostUrl + "Uploads/StudentProfile/" + filename;
            }
            return imgUrl;
        }


    }
}
