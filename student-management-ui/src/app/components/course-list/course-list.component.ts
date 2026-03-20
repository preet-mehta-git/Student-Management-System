import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course, CreateCourse } from '../../models/models';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <div class="header-text">
          <h1>Courses</h1>
          <p>Manage available courses in the system</p>
        </div>
        <button class="btn-add" (click)="showForm = true" *ngIf="isAdmin && !showForm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Course
        </button>
      </div>

      <!-- Add/Edit Form -->
      <div class="form-card" *ngIf="showForm">
        <div class="form-card-header">
          <h2>{{ editingId ? 'Edit Course' : 'New Course' }}</h2>
          <button class="form-close" (click)="cancelForm()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label>Course Name</label>
              <input type="text" [(ngModel)]="formData.courseName" name="courseName" placeholder="Course Name" required>
            </div>
            <div class="form-group credits-group">
              <label>Credits</label>
              <input type="number" [(ngModel)]="formData.credits" name="credits" min="1" max="10" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="formData.description" name="description" rows="3" placeholder="Course description"></textarea>
          </div>
          <div class="error-msg" *ngIf="error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ error }}
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancel</button>
            <button type="submit" class="btn-primary">{{ editingId ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>

      <!-- Course Grid -->
      <div class="courses-grid" *ngIf="!loading">
        <div class="course-card" *ngFor="let c of courses; let i = index"
             [style.animation-delay]="(i * 0.08) + 's'">
          <div class="card-accent" [style.background]="getAccentGradient(i)"></div>
          <div class="course-top">
            <div class="course-icon" [style.background]="getIconBg(i)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <span class="credits-badge">{{ c.credits }} Credit{{ c.credits !== 1 ? 's' : '' }}</span>
          </div>
          <h3>{{ c.courseName }}</h3>
          <p class="course-desc">{{ c.description || 'No description available' }}</p>
          <div class="course-footer">
            <div class="student-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {{ c.studentCount }} student{{ c.studentCount !== 1 ? 's' : '' }}
            </div>
            <div class="actions" *ngIf="isAdmin">
              <button class="btn-edit" (click)="editCourse(c)" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-delete" (click)="deleteCourse(c.id)" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty / Loading -->
      <div class="empty-state" *ngIf="courses.length === 0 && !loading">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="opacity:0.25">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        <p>No courses found</p>
        <span>Add your first course to get started</span>
      </div>
      <div class="loading-grid" *ngIf="loading">
        <div class="skeleton-card" *ngFor="let i of [1,2,3]">
          <div class="skeleton" style="width:44px;height:44px;border-radius:12px"></div>
          <div class="skeleton" style="width:70%;height:18px;margin-top:16px"></div>
          <div class="skeleton" style="width:100%;height:14px;margin-top:8px"></div>
          <div class="skeleton" style="width:50%;height:14px;margin-top:4px"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: calc(100vh - var(--navbar-height));
      background: var(--gradient-bg);
      padding: var(--space-xl);
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: var(--space-lg); animation: fadeInUp 0.5s ease-out;
    }
    .page-header h1 {
      font-family: var(--font-display); color: var(--color-text-primary);
      font-size: 30px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.5px;
    }
    .page-header p { color: var(--color-text-muted); font-size: 15px; margin: 0; }
    .btn-add {
      padding: 12px 22px; background: var(--gradient-accent);
      border: none; border-radius: var(--radius-md); color: #fff;
      font-size: 14px; font-weight: 600; font-family: var(--font-body);
      cursor: pointer; transition: all var(--transition-base);
      display: flex; align-items: center; gap: 8px;
    }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--color-accent-glow); }

    /* Form Card */
    .form-card {
      background: var(--color-bg-card); backdrop-filter: blur(16px);
      border: 1px solid var(--color-border); border-radius: var(--radius-lg);
      padding: var(--space-lg); margin-bottom: var(--space-lg);
      animation: fadeInDown 0.3s ease-out;
    }
    .form-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .form-card-header h2 { color: var(--color-text-primary); font-family: var(--font-display); font-size: 18px; font-weight: 600; margin: 0; }
    .form-close {
      background: none; border: none; color: var(--color-text-muted);
      cursor: pointer; padding: 6px; border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .form-close:hover { color: var(--color-text-primary); background: rgba(255,255,255,0.06); }
    .form-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block; color: var(--color-text-secondary);
      font-size: 13px; font-weight: 600; margin-bottom: 8px;
    }
    .form-group input, .form-group textarea {
      width: 100%; padding: 12px 14px;
      background: var(--color-bg-input); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); color: var(--color-text-primary);
      font-size: 14px; font-family: var(--font-body);
      transition: all var(--transition-base); box-sizing: border-box;
    }
    .form-group textarea { resize: vertical; min-height: 80px; }
    .form-group input:focus, .form-group textarea:focus {
      outline: none; border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
    .form-group input::placeholder, .form-group textarea::placeholder { color: var(--color-text-faint); }
    .error-msg {
      display: flex; align-items: center; gap: 8px; color: var(--color-danger);
      font-size: 14px; margin-bottom: 12px; padding: 12px 16px;
      background: var(--color-danger-bg); border: 1px solid var(--color-danger-border);
      border-radius: var(--radius-md);
    }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn-cancel {
      padding: 10px 20px; background: rgba(255,255,255,0.06);
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      color: var(--color-text-secondary); font-family: var(--font-body);
      cursor: pointer; transition: all var(--transition-base);
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.1); }
    .btn-primary {
      padding: 10px 24px; background: var(--gradient-accent);
      border: none; border-radius: var(--radius-md); color: #fff;
      font-weight: 600; font-family: var(--font-body);
      cursor: pointer; transition: all var(--transition-base);
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px var(--color-accent-glow); }

    /* Course Grid */
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .course-card {
      background: var(--color-bg-card); backdrop-filter: blur(16px);
      border: 1px solid var(--color-border); border-radius: var(--radius-lg);
      padding: var(--space-lg); position: relative; overflow: hidden;
      transition: all var(--transition-base);
      animation: fadeInUp 0.5s ease-out backwards;
    }
    .course-card:hover {
      transform: translateY(-4px); border-color: var(--color-border-hover);
      box-shadow: var(--shadow-card);
    }
    .card-accent {
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
    }
    .course-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 16px;
    }
    .course-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .credits-badge {
      background: var(--color-success-bg); color: var(--color-success);
      padding: 4px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 600; white-space: nowrap;
    }
    .course-card h3 {
      color: var(--color-text-primary); font-family: var(--font-display);
      font-size: 18px; font-weight: 600; margin: 0 0 8px;
    }
    .course-desc {
      color: var(--color-text-muted); font-size: 14px;
      margin: 0 0 18px; line-height: 1.5;
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
    }
    .course-footer { display: flex; justify-content: space-between; align-items: center; }
    .student-count {
      display: flex; align-items: center; gap: 6px;
      color: var(--color-text-muted); font-size: 13px;
    }
    .student-count svg { opacity: 0.5; }
    .actions { display: flex; gap: 6px; }
    .btn-edit, .btn-delete {
      width: 34px; height: 34px; border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--transition-fast); border: 1px solid;
    }
    .btn-edit {
      background: var(--color-success-bg); border-color: var(--color-success-border); color: var(--color-success);
    }
    .btn-edit:hover { background: rgba(6,214,160,0.2); transform: translateY(-1px); }
    .btn-delete {
      background: var(--color-danger-bg); border-color: var(--color-danger-border); color: var(--color-danger);
    }
    .btn-delete:hover { background: rgba(255,107,107,0.2); transform: translateY(-1px); }

    /* Empty / Loading */
    .empty-state {
      text-align: center; padding: 56px 24px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .empty-state p { color: var(--color-text-secondary); font-size: 16px; font-weight: 600; margin: 8px 0 0; }
    .empty-state span { color: var(--color-text-muted); font-size: 14px; }
    .loading-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;
    }
    .skeleton-card {
      background: var(--color-bg-card); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); padding: var(--space-lg);
    }
    @media (max-width: 768px) { .page { padding: var(--space-md); } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  showForm = false;
  editingId: number | null = null;
  formData: CreateCourse = { courseName: '', description: '', credits: 3 };
  error = '';
  loading = true;
  isAdmin = false;

  private accents = [
    'linear-gradient(90deg, #4318FF, #868CFF)',
    'linear-gradient(90deg, #05CD99, #34d399)',
    'linear-gradient(90deg, #39B8FF, #7dd3fc)',
    'linear-gradient(90deg, #FFCE20, #fbbf24)',
    'linear-gradient(90deg, #EE5D50, #f87171)',
  ];

  private iconBgs = [
    'linear-gradient(135deg, rgba(67,24,255,0.15), rgba(134,140,255,0.15))',
    'linear-gradient(135deg, rgba(5,205,153,0.15), rgba(52,211,153,0.15))',
    'linear-gradient(135deg, rgba(57,184,255,0.15), rgba(125,211,252,0.15))',
    'linear-gradient(135deg, rgba(255,206,32,0.15), rgba(245,158,11,0.15))',
    'linear-gradient(135deg, rgba(238,93,80,0.15), rgba(248,113,113,0.15))',
  ];

  constructor(private courseService: CourseService, private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (data) => { this.courses = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getAccentGradient(i: number) { return this.accents[i % this.accents.length]; }
  getIconBg(i: number) { return this.iconBgs[i % this.iconBgs.length]; }

  onSubmit() {
    this.error = '';
    const request = this.editingId
      ? this.courseService.updateCourse(this.editingId, this.formData)
      : this.courseService.createCourse(this.formData);
    request.subscribe({
      next: () => { this.cancelForm(); this.loadCourses(); },
      error: (err) => this.error = err.error?.message || 'An error occurred'
    });
  }

  editCourse(course: Course) {
    this.editingId = course.id;
    this.formData = { courseName: course.courseName, description: course.description, credits: course.credits };
    this.showForm = true;
  }

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (err) => alert(err.error?.message || 'Cannot delete course')
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.formData = { courseName: '', description: '', credits: 3 };
    this.error = '';
  }
}
