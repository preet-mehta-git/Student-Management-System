using System.ComponentModel.DataAnnotations;

namespace StudentManagementAPI.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Credits { get; set; }
        public int StudentCount { get; set; }
    }

    public class CreateCourseDto
    {
        [Required]
        [MaxLength(100)]
        public string CourseName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)]
        public int Credits { get; set; }
    }
}
