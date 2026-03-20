using System.ComponentModel.DataAnnotations;

namespace StudentManagementAPI.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Student";
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
    }

    public class DashboardDto
    {
        public int TotalStudents { get; set; }
        public int TotalCourses { get; set; }
        public List<StudentDto> RecentEnrollments { get; set; } = new();
        public List<CourseStudentCount> CourseDistribution { get; set; } = new();
    }

    public class CourseStudentCount
    {
        public string CourseName { get; set; } = string.Empty;
        public int StudentCount { get; set; }
    }
}
