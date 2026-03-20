import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/models';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard">
      <div class="page-header">
        <div class="header-content">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your student management system.</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card" *ngFor="let stat of statCards; let i = index"
             [style.animation-delay]="(i * 0.1) + 's'">
          <div class="stat-icon-wrapper" [style.background]="stat.bg">
            <span [innerHTML]="stat.icon"></span>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
          <div class="stat-accent" [style.background]="stat.accent"></div>
        </div>
      </div>

      <!-- Skeleton loading -->
      <div class="stats-grid" *ngIf="!stats">
        <div class="stat-card skeleton-card" *ngFor="let i of [1,2,3]">
          <div class="skeleton" style="width:48px;height:48px;border-radius:14px"></div>
          <div class="stat-info">
            <div class="skeleton" style="width:60px;height:28px;margin-bottom:6px"></div>
            <div class="skeleton" style="width:100px;height:14px"></div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" *ngIf="stats">
        <!-- Recent Enrollments -->
        <div class="card enrollments-card">
          <div class="card-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Recent Enrollments
            </h2>
            <span class="card-badge" *ngIf="stats.recentEnrollments.length > 0">{{ stats.recentEnrollments.length }} new</span>
          </div>
          <div class="table-container" *ngIf="stats.recentEnrollments.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of stats.recentEnrollments; let i = index"
                    [style.animation-delay]="(i * 0.05) + 's'" class="table-row-animate">
                  <td>
                    <div class="student-cell">
                      <div class="student-avatar">{{ s.name.charAt(0) }}</div>
                      <div class="student-info-cell">
                        <span class="student-name">{{ s.name }}</span>
                        <span class="student-email">{{ s.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="course-badge">{{ s.courseName }}</span></td>
                  <td class="date-cell">{{ s.enrollmentDate | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" *ngIf="stats.recentEnrollments.length === 0">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>No enrollments yet</p>
          </div>
        </div>

        <!-- Course Distribution -->
        <div class="card distribution-card">
          <div class="card-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Course Distribution
            </h2>
          </div>
          <div class="dist-list" *ngIf="stats.courseDistribution.length > 0">
            <div class="dist-item" *ngFor="let c of stats.courseDistribution; let i = index"
                 [style.animation-delay]="(i * 0.1) + 's'">
              <div class="dist-info">
                <span class="dist-name">{{ c.courseName }}</span>
                <span class="dist-count">{{ c.studentCount }} student{{ c.studentCount !== 1 ? 's' : '' }}</span>
              </div>
              <div class="dist-bar">
                <div class="dist-fill"
                     [style.width.%]="getBarWidth(c.studentCount)"
                     [style.background]="getBarGradient(i)">
                </div>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="stats.courseDistribution.length === 0">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <p>No courses yet</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: calc(100vh - var(--navbar-height));
      background: var(--gradient-bg);
      padding: var(--space-xl);
    }

    .page-header { margin-bottom: var(--space-xl); animation: fadeInUp 0.5s ease-out; }
    .page-header h1 {
      font-family: var(--font-display);
      color: var(--color-text-primary);
      font-size: 30px;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }
    .page-header p { color: var(--color-text-muted); font-size: 15px; margin: 0; }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: var(--color-bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: 18px;
      transition: all var(--transition-base);
      animation: fadeInUp 0.5s ease-out backwards;
      position: relative;
      overflow: hidden;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-border-hover);
      box-shadow: var(--shadow-card);
    }

    .stat-accent {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      opacity: 0.6;
    }

    .stat-icon-wrapper {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      font-size: 0;
    }
    .stat-icon-wrapper :first-child {
      color: white;
    }

    .stat-number {
      display: block;
      color: var(--color-text-primary);
      font-family: var(--font-display);
      font-size: 30px;
      font-weight: 700;
      line-height: 1.1;
      animation: countUp 0.6s ease-out;
    }
    .stat-label {
      color: var(--color-text-muted);
      font-size: 13px;
      font-weight: 500;
      margin-top: 2px;
    }

    .skeleton-card {
      animation: none !important;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: var(--space-lg);
    }

    .card {
      background: var(--color-bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      animation: fadeInUp 0.5s ease-out 0.3s backwards;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .card-header h2 {
      color: var(--color-text-primary);
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-header h2 svg { opacity: 0.6; }

    .card-badge {
      background: rgba(67, 24, 255, 0.08);
      color: var(--color-accent-light);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Table */
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      padding: 10px 14px;
      color: var(--color-text-muted);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border-bottom: 1px solid var(--color-border);
    }
    td {
      padding: 12px 14px;
      color: var(--color-text-secondary);
      font-size: 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    }
    tr:last-child td { border-bottom: none; }
    .table-row-animate { animation: fadeInUp 0.4s ease-out backwards; }

    .student-cell { display: flex; align-items: center; gap: 12px; }
    .student-avatar {
      width: 34px; height: 34px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, rgba(67, 24, 255, 0.12), rgba(134, 140, 255, 0.12));
      color: var(--color-accent-light);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
      font-size: 13px;
      flex-shrink: 0;
    }
    .student-info-cell { display: flex; flex-direction: column; }
    .student-name { color: var(--color-text-primary); font-weight: 600; font-size: 14px; }
    .student-email { color: var(--color-text-muted); font-size: 12px; }

    .course-badge {
      background: rgba(67, 24, 255, 0.08);
      color: var(--color-accent-light);
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
    .date-cell { color: var(--color-text-muted); font-size: 13px; white-space: nowrap; }

    /* Distribution */
    .dist-item {
      margin-bottom: 18px;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .dist-item:last-child { margin-bottom: 0; }
    .dist-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .dist-name { color: var(--color-text-secondary); font-size: 14px; font-weight: 500; }
    .dist-count { color: var(--color-text-muted); font-size: 13px; }
    .dist-bar {
      height: 6px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 3px;
      overflow: hidden;
    }
    .dist-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 32px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .empty-state p { color: var(--color-text-muted); font-size: 14px; }

    @media (max-width: 768px) {
      .dashboard { padding: var(--space-md); }
      .stats-grid { grid-template-columns: 1fr; }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  statCards: { icon: string; value: number; label: string; bg: string; accent: string }[] = [];

  private barGradients = [
    'linear-gradient(90deg, #4318FF, #868CFF)',
    'linear-gradient(90deg, #05CD99, #34d399)',
    'linear-gradient(90deg, #39B8FF, #7dd3fc)',
    'linear-gradient(90deg, #FFCE20, #fbbf24)',
    'linear-gradient(90deg, #EE5D50, #f87171)',
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.statCards = [
          {
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            value: data.totalStudents,
            label: 'Total Students',
            bg: 'linear-gradient(135deg, rgba(67,24,255,0.15), rgba(134,140,255,0.15))',
            accent: 'linear-gradient(90deg, #4318FF, #868CFF)'
          },
          {
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
            value: data.totalCourses,
            label: 'Total Courses',
            bg: 'linear-gradient(135deg, rgba(5,205,153,0.15), rgba(52,211,153,0.15))',
            accent: 'linear-gradient(90deg, #05CD99, #34d399)'
          },
          {
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
            value: data.recentEnrollments.length,
            label: 'Recent Enrollments',
            bg: 'linear-gradient(135deg, rgba(255,206,32,0.15), rgba(251,191,36,0.15))',
            accent: 'linear-gradient(90deg, #FFCE20, #fbbf24)'
          }
        ];
      },
      error: (err) => console.error('Dashboard error:', err)
    });
  }

  getBarWidth(count: number): number {
    if (!this.stats || this.stats.totalStudents === 0) return 0;
    return (count / this.stats.totalStudents) * 100;
  }

  getBarGradient(index: number): string {
    return this.barGradients[index % this.barGradients.length];
  }
}
