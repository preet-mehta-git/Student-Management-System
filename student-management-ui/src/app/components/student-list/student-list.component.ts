import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/models';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <div class="header-text">
          <h1>Students</h1>
          <p>Manage all registered students in the system</p>
        </div>
        <button class="btn-add" (click)="goToAdd()" *ngIf="isAdmin" id="add-student-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Student
        </button>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <div class="search-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch()"
                 placeholder="Search students by name, email, or course..." id="student-search">
          <button class="search-clear" *ngIf="searchTerm" (click)="searchTerm = ''; onSearch()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card" *ngIf="!loading">
        <div class="table-container" *ngIf="students.length > 0">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Enrolled</th>
                <th *ngIf="isAdmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of students; let i = index" class="row-animate"
                  [style.animation-delay]="(i * 0.04) + 's'">
                <td>
                  <div class="student-cell">
                    <div class="avatar" [style.background]="getAvatarColor(i)">
                      {{ s.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="student-info">
                      <span class="student-name">{{ s.name }}</span>
                      <span class="student-id">#{{ s.id }}</span>
                    </div>
                  </div>
                </td>
                <td class="email-cell">{{ s.email }}</td>
                <td class="phone-cell">{{ s.phone || '—' }}</td>
                <td><span class="course-badge" [style.background]="getBadgeColor(i)">{{ s.courseName }}</span></td>
                <td class="date-cell">{{ s.enrollmentDate | date:'mediumDate' }}</td>
                <td *ngIf="isAdmin">
                  <div class="actions">
                    <button class="btn-edit" (click)="goToEdit(s.id)" title="Edit student">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button class="btn-delete" (click)="deleteStudent(s.id)" title="Delete student">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="students.length === 0">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.25">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p>No students found</p>
          <span>{{ searchTerm ? 'Try adjusting your search query' : 'Add your first student to get started' }}</span>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div class="table-card" *ngIf="loading">
        <div class="skeleton-rows">
          <div class="skeleton-row" *ngFor="let i of [1,2,3,4,5]">
            <div class="skeleton" style="width:36px;height:36px;border-radius:50%"></div>
            <div style="flex:1">
              <div class="skeleton" style="width:140px;height:14px;margin-bottom:6px"></div>
              <div class="skeleton" style="width:80px;height:12px"></div>
            </div>
            <div class="skeleton" style="width:160px;height:14px"></div>
            <div class="skeleton" style="width:80px;height:14px"></div>
            <div class="skeleton" style="width:90px;height:24px;border-radius:6px"></div>
          </div>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      animation: fadeInUp 0.5s ease-out;
    }
    .page-header h1 {
      font-family: var(--font-display);
      color: var(--color-text-primary);
      font-size: 30px;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }
    .page-header p { color: var(--color-text-muted); font-size: 15px; margin: 0; }

    .btn-add {
      padding: 12px 22px;
      background: var(--gradient-accent);
      border: none;
      border-radius: var(--radius-md);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }
    .btn-add::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0));
      opacity: 0; transition: opacity var(--transition-base);
    }
    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px var(--color-accent-glow);
    }
    .btn-add:hover::before { opacity: 1; }

    /* Search */
    .search-bar {
      margin-bottom: var(--space-lg);
      animation: fadeInUp 0.5s ease-out 0.1s backwards;
    }
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 16px;
      color: var(--color-text-faint);
      pointer-events: none;
      transition: color var(--transition-base);
    }
    .search-wrapper:focus-within .search-icon { color: var(--color-accent); }
    .search-bar input {
      width: 100%;
      padding: 14px 44px 14px 48px;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      color: var(--color-text-primary);
      font-size: 15px;
      font-family: var(--font-body);
      transition: all var(--transition-base);
    }
    .search-bar input:focus {
      outline: none;
      border-color: var(--color-accent);
      background: var(--color-bg-input-focus);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .search-bar input::placeholder { color: var(--color-text-faint); }
    .search-clear {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      color: var(--color-text-faint);
      cursor: pointer;
      padding: 4px;
      display: flex;
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
    }
    .search-clear:hover { color: var(--color-text-secondary); background: rgba(255,255,255,0.06); }

    /* Table Card */
    .table-card {
      background: var(--color-bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      animation: fadeInUp 0.5s ease-out 0.2s backwards;
    }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }

    th {
      text-align: left;
      padding: 14px 16px;
      color: var(--color-text-muted);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(0, 0, 0, 0.02);
      border-bottom: 1px solid var(--color-border);
    }

    td {
      padding: 14px 16px;
      color: var(--color-text-secondary);
      font-size: 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    }
    tr:last-child td { border-bottom: none; }

    tbody tr {
      transition: background var(--transition-fast);
    }
    tbody tr:hover {
      background: rgba(0, 0, 0, 0.02);
    }

    .row-animate { animation: fadeInUp 0.4s ease-out backwards; }

    .student-cell { display: flex; align-items: center; gap: 12px; }
    .avatar {
      width: 38px; height: 38px;
      border-radius: var(--radius-full);
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }
    .student-info { display: flex; flex-direction: column; }
    .student-name { color: var(--color-text-primary); font-weight: 600; font-size: 14px; }
    .student-id { color: var(--color-text-faint); font-size: 12px; }

    .email-cell { color: var(--color-text-secondary); }
    .phone-cell { color: var(--color-text-muted); }
    .date-cell { color: var(--color-text-muted); font-size: 13px; white-space: nowrap; }

    .course-badge {
      padding: 5px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      color: #fff;
    }

    .actions { display: flex; gap: 8px; }
    .btn-edit, .btn-delete {
      padding: 7px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-body);
    }
    .btn-edit {
      background: var(--color-success-bg);
      border: 1px solid var(--color-success-border);
      color: var(--color-success);
    }
    .btn-edit:hover { background: rgba(6, 214, 160, 0.2); transform: translateY(-1px); }
    .btn-delete {
      background: var(--color-danger-bg);
      border: 1px solid var(--color-danger-border);
      color: var(--color-danger);
    }
    .btn-delete:hover { background: rgba(255, 107, 107, 0.2); transform: translateY(-1px); }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 56px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .empty-state p { color: var(--color-text-secondary); font-size: 16px; font-weight: 600; margin: 8px 0 0; }
    .empty-state span { color: var(--color-text-muted); font-size: 14px; }

    /* Skeleton */
    .skeleton-rows { padding: 16px; }
    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    }
    .skeleton-row:last-child { border-bottom: none; }

    @media (max-width: 768px) {
      .page { padding: var(--space-md); }
      .page-header { flex-direction: column; gap: 16px; align-items: flex-start; }
      table { font-size: 13px; }
      th, td { padding: 10px 12px; }
    }
  `]
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  searchTerm = '';
  loading = true;
  isAdmin = false;

  private avatarColors = [
    'linear-gradient(135deg, #4318FF, #868CFF)',
    'linear-gradient(135deg, #05CD99, #43E97B)',
    'linear-gradient(135deg, #39B8FF, #00E5FF)',
    'linear-gradient(135deg, #FFCE20, #FFD000)',
    'linear-gradient(135deg, #EE5D50, #FF7588)',
    'linear-gradient(135deg, #8b5cf6, #d946ef)',
  ];

  private badgeColors = [
    'rgba(67, 24, 255, 0.12)',
    'rgba(5, 205, 153, 0.18)',
    'rgba(57, 184, 255, 0.18)',
    'rgba(255, 206, 32, 0.18)',
    'rgba(238, 93, 80, 0.18)',
  ];

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.studentService.getStudents(this.searchTerm).subscribe({
      next: (data) => { this.students = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch() {
    this.loadStudents();
  }

  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  getBadgeColor(index: number): string {
    return this.badgeColors[index % this.badgeColors.length];
  }

  goToAdd() { this.router.navigate(['/students/add']); }
  goToEdit(id: number) { this.router.navigate(['/students/edit', id]); }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe(() => this.loadStudents());
    }
  }
}
