export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  courseId: number;
  courseName: string;
}

export interface CreateStudent {
  name: string;
  email: string;
  phone: string;
  courseId: number;
}

export interface Course {
  id: number;
  courseName: string;
  description: string;
  credits: number;
  studentCount: number;
}

export interface CreateCourse {
  courseName: string;
  description: string;
  credits: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  expiration: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  recentEnrollments: Student[];
  courseDistribution: CourseStudentCount[];
}

export interface CourseStudentCount {
  courseName: string;
  studentCount: number;
}
