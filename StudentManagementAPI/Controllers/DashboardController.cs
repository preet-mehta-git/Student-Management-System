using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.DTOs;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDto>> GetDashboard()
        {
            var totalStudents = await _context.Students.CountAsync();
            var totalCourses = await _context.Courses.CountAsync();

            var recentEnrollments = await _context.Students
                .Include(s => s.Course)
                .OrderByDescending(s => s.EnrollmentDate)
                .Take(5)
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

            var courseDistribution = await _context.Courses
                .Include(c => c.Students)
                .Select(c => new CourseStudentCount
                {
                    CourseName = c.CourseName,
                    StudentCount = c.Students.Count
                })
                .OrderByDescending(c => c.StudentCount)
                .ToListAsync();

            return Ok(new DashboardDto
            {
                TotalStudents = totalStudents,
                TotalCourses = totalCourses,
                RecentEnrollments = recentEnrollments,
                CourseDistribution = courseDistribution
            });
        }
    }
}
