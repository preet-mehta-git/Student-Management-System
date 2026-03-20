using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.DTOs;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents([FromQuery] string? search)
        {
            var query = _context.Students.Include(s => s.Course).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(s =>
                    s.Name.ToLower().Contains(search) ||
                    s.Email.ToLower().Contains(search) ||
                    s.Course!.CourseName.ToLower().Contains(search));
            }

            var students = await query
                .OrderByDescending(s => s.EnrollmentDate)
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    Phone = s.Phone,
                    EnrollmentDate = s.EnrollmentDate,
                    CourseId = s.CourseId,
                    CourseName = s.Course!.CourseName
                })
                .ToListAsync();

            return Ok(students);
        }

        // GET: api/students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.Course)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
                return NotFound(new { message = "Student not found" });

            return Ok(new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Phone = student.Phone,
                EnrollmentDate = student.EnrollmentDate,
                CourseId = student.CourseId,
                CourseName = student.Course!.CourseName
            });
        }

        // POST: api/students
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var course = await _context.Courses.FindAsync(dto.CourseId);
            if (course == null)
                return BadRequest(new { message = "Invalid course ID" });

            if (await _context.Students.AnyAsync(s => s.Email == dto.Email))
                return BadRequest(new { message = "A student with this email already exists" });

            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                CourseId = dto.CourseId,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Phone = student.Phone,
                EnrollmentDate = student.EnrollmentDate,
                CourseId = student.CourseId,
                CourseName = course.CourseName
            });
        }

        // PUT: api/students/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound(new { message = "Student not found" });

            var course = await _context.Courses.FindAsync(dto.CourseId);
            if (course == null)
                return BadRequest(new { message = "Invalid course ID" });

            // Check if email is taken by another student
            if (await _context.Students.AnyAsync(s => s.Email == dto.Email && s.Id != id))
                return BadRequest(new { message = "A student with this email already exists" });

            student.Name = dto.Name;
            student.Email = dto.Email;
            student.Phone = dto.Phone;
            student.CourseId = dto.CourseId;

            await _context.SaveChangesAsync();

            return Ok(new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Phone = student.Phone,
                EnrollmentDate = student.EnrollmentDate,
                CourseId = student.CourseId,
                CourseName = course.CourseName
            });
        }

        // DELETE: api/students/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound(new { message = "Student not found" });

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student deleted successfully" });
        }
    }
}
