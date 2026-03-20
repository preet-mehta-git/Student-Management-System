import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { Course, CreateStudent } from '../../models/models';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="form-card">
        <div class="form-header">
          <div class="form-icon" [class.edit-mode]="isEdit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h1>{{ isEdit ? 'Edit Student' : 'Add New Student' }}</h1>
          <p>{{ isEdit ? 'Update the student information below' : 'Fill in the details to register a new student' }}</p>
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-section">
            <div class="section-label">Personal Information</div>
            <div class="form-group">
              <label for="sf-name">Full Name</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="sf-name" [(ngModel)]="student.name" name="name" placeholder="Enter student name" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="sf-email">Email</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" id="sf-email" [(ngModel)]="student.email" name="email" placeholder="student@email.com" required>
                </div>
              </div>
              <div class="form-group">
                <label for="sf-phone">Phone</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="text" id="sf-phone" [(ngModel)]="student.phone" name="phone" placeholder="Phone number">
                </div>
              </div>
            </div>
          </div>
          <div class="form-section">
            <div class="section-label">Academic Details</div>
            <div class="form-group">
              <label for="sf-course">Course</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>
                <select id="sf-course" [(ngModel)]="student.courseId" name="courseId" required>
                  <option [ngValue]="0" disabled>Select a course</option>
                  <option *ngFor="let c of courses" [ngValue]="c.id">{{ c.courseName }} ({{ c.credits }} credits)</option>
                </select>
              </div>
            </div>
          </div>
          <div class="error-msg" *ngIf="error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ error }}
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              <span class="btn-spinner" *ngIf="loading"></span>
              {{ loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: calc(100vh - var(--navbar-height));
      background: var(--gradient-bg);
      padding: var(--space-xl);
      display: flex;
      justify-content: center;
    }
    .form-card {
      background: var(--color-bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 44px;
      width: 100%;
      max-width: 640px;
      height: fit-content;
      animation: fadeInUp 0.5s ease-out;
    }
    .form-header { text-align: center; margin-bottom: 36px; }
    .form-icon {
      width: 56px; height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(124,92,252,0.2), rgba(168,85,247,0.2));
      display: flex; align-items: center; justify-content: center;
      color: var(--color-accent-light);
      margin: 0 auto 16px;
    }
    .form-icon.edit-mode {
      background: linear-gradient(135deg, rgba(6,214,160,0.2), rgba(52,211,153,0.2));
      color: var(--color-success);
    }
    .form-header h1 {
      font-family: var(--font-display);
      color: var(--color-text-primary);
      font-size: 24px; font-weight: 700; margin: 0 0 8px;
    }
    .form-header p { color: var(--color-text-muted); font-size: 14px; margin: 0; }
    .form-section { margin-bottom: 28px; animation: fadeInUp 0.5s ease-out backwards; }
    .form-section:nth-child(1) { animation-delay: 0.1s; }
    .form-section:nth-child(2) { animation-delay: 0.2s; }
    .section-label {
      color: var(--color-text-muted); font-size: 12px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px;
      margin-bottom: 16px; padding-bottom: 10px;
      border-bottom: 1px solid var(--color-border);
    }
    .form-group { margin-bottom: 18px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group label {
      display: block; color: var(--color-text-secondary);
      font-size: 13px; font-weight: 600; margin-bottom: 8px;
    }
    .input-wrapper { position: relative; display: flex; align-items: center; }
    .input-icon {
      position: absolute; left: 14px; color: var(--color-text-faint);
      transition: color var(--transition-base); pointer-events: none;
    }
    .input-wrapper:focus-within .input-icon { color: var(--color-accent); }
    .form-group input, .form-group select {
      width: 100%; padding: 13px 16px 13px 44px;
      background: var(--color-bg-input); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); color: var(--color-text-primary);
      font-size: 15px; font-family: var(--font-body);
      transition: all var(--transition-base); appearance: none;
    }
    .form-group select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(0,0,0,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px;
    }
    .form-group select option { background: #ffffff; color: #1e293b; }
    .form-group input:focus, .form-group select:focus {
      outline: none; border-color: var(--color-accent);
      background: var(--color-bg-input-focus);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
    .form-group input::placeholder { color: var(--color-text-faint); }
    .error-msg {
      display: flex; align-items: center; gap: 8px;
      color: var(--color-danger); font-size: 14px; margin-bottom: 20px;
      padding: 12px 16px; background: var(--color-danger-bg);
      border: 1px solid var(--color-danger-border); border-radius: var(--radius-md);
    }
    .form-actions {
      display: flex; gap: 12px; justify-content: flex-end;
      margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--color-border);
    }
    .btn-cancel {
      padding: 12px 22px; background: rgba(255,255,255,0.06);
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      color: var(--color-text-secondary); font-size: 14px; font-weight: 500;
      font-family: var(--font-body); cursor: pointer; transition: all var(--transition-base);
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.1); color: var(--color-text-primary); }
    .btn-primary {
      padding: 12px 28px; background: var(--gradient-accent);
      border: none; border-radius: var(--radius-md); color: #fff;
      font-size: 14px; font-weight: 600; font-family: var(--font-body);
      cursor: pointer; transition: all var(--transition-base);
      display: flex; align-items: center; gap: 8px;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px var(--color-accent-glow); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @media (max-width: 640px) {
      .page { padding: var(--space-md); }
      .form-card { padding: 28px 20px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class StudentFormComponent implements OnInit {
  student: CreateStudent = { name: '', email: '', phone: '', courseId: 0 };
  courses: Course[] = [];
  isEdit = false;
  studentId = 0;
  error = '';
  loading = false;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe(c => this.courses = c);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.studentId = +id;
      this.studentService.getStudent(this.studentId).subscribe(s => {
        this.student = { name: s.name, email: s.email, phone: s.phone, courseId: s.courseId };
      });
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    const request = this.isEdit
      ? this.studentService.updateStudent(this.studentId, this.student)
      : this.studentService.createStudent(this.student);
    request.subscribe({
      next: () => this.router.navigate(['/students']),
      error: (err) => { this.error = err.error?.message || 'An error occurred'; this.loading = false; }
    });
  }

  goBack() { this.router.navigate(['/students']); }
}
