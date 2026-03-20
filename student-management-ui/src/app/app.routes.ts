import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'students', loadComponent: () => import('./components/student-list/student-list.component').then(m => m.StudentListComponent), canActivate: [authGuard] },
  { path: 'students/add', loadComponent: () => import('./components/student-form/student-form.component').then(m => m.StudentFormComponent), canActivate: [authGuard] },
  { path: 'students/edit/:id', loadComponent: () => import('./components/student-form/student-form.component').then(m => m.StudentFormComponent), canActivate: [authGuard] },
  { path: 'courses', loadComponent: () => import('./components/course-list/course-list.component').then(m => m.CourseListComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
