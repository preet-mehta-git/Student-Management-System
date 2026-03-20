using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed some default courses
            modelBuilder.Entity<Course>().HasData(
                new Course { Id = 1, CourseName = "Computer Science", Description = "Study of computation and programming", Credits = 4 },
                new Course { Id = 2, CourseName = "Mathematics", Description = "Study of numbers, quantities, and shapes", Credits = 3 },
                new Course { Id = 3, CourseName = "Physics", Description = "Study of matter, energy, and the universe", Credits = 3 },
                new Course { Id = 4, CourseName = "Electronics", Description = "Study of electronic circuits and devices", Credits = 4 },
                new Course { Id = 5, CourseName = "Mechanical Engineering", Description = "Study of machines and mechanical systems", Credits = 4 }
            );

            // Configure relationships
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Course)
                .WithMany(c => c.Students)
                .HasForeignKey(s => s.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Student>()
                .HasIndex(s => s.Email)
                .IsUnique();
        }
    }
}
