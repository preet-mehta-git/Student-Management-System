import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <!-- Animated background orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
              </svg>
            </div>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your student management account</p>
        </div>

        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="login-username">Username</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text" id="login-username" [(ngModel)]="username" name="username"
                     placeholder="Enter your username" required autocomplete="username">
            </div>
          </div>

          <div class="form-group">
            <label for="login-password">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input [type]="showPassword ? 'text' : 'password'" id="login-password"
                     [(ngModel)]="password" name="password"
                     placeholder="Enter your password" required autocomplete="current-password">
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword" tabindex="-1">
                <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="error-msg" *ngIf="error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading" id="login-submit">
            <span class="btn-spinner" *ngIf="loading"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient-auth);
      padding: var(--space-lg);
      position: relative;
      overflow: hidden;
    }

    /* Animated floating orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
    .orb-1 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0) 70%);
      top: -100px; left: -100px;
      animation: float 8s ease-in-out infinite;
    }
    .orb-2 {
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0) 70%);
      bottom: -80px; right: -80px;
      animation: float 10s ease-in-out infinite 2s;
    }
    .orb-3 {
      width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(20, 184, 166, 0.5) 0%, rgba(20, 184, 166, 0) 70%);
      top: 50%; left: 60%;
      animation: float 12s ease-in-out infinite 4s;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: var(--radius-xl);
      padding: 48px 44px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.04);
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .logo-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .logo-icon {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: var(--gradient-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 24px var(--color-accent-glow);
      animation: float 4s ease-in-out infinite;
    }

    .auth-header h1 {
      font-family: var(--font-display);
      color: var(--color-text-primary);
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }

    .auth-header p {
      color: var(--color-text-muted);
      font-size: 15px;
      margin: 0;
    }

    .form-group {
      margin-bottom: 22px;
      animation: fadeInUp 0.5s ease-out backwards;
    }
    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.2s; }

    .form-group label {
      display: block;
      color: var(--color-text-secondary);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: var(--color-text-faint);
      transition: color var(--transition-base);
      pointer-events: none;
      flex-shrink: 0;
    }

    .input-wrapper:focus-within .input-icon {
      color: var(--color-accent);
    }

    .form-group input {
      width: 100%;
      padding: 14px 44px 14px 44px;
      background: var(--color-bg-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-size: 15px;
      font-family: var(--font-body);
      transition: all var(--transition-base);
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-accent);
      background: var(--color-bg-input-focus);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }

    .form-group input::placeholder {
      color: var(--color-text-faint);
    }

    .toggle-password {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      color: var(--color-text-faint);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      transition: color var(--transition-base);
    }
    .toggle-password:hover {
      color: var(--color-text-secondary);
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-danger);
      font-size: 14px;
      margin-bottom: 20px;
      padding: 12px 16px;
      background: var(--color-danger-bg);
      border: 1px solid var(--color-danger-border);
      border-radius: var(--radius-md);
      animation: fadeInUp 0.3s ease-out;
    }

    .btn-primary {
      width: 100%;
      padding: 15px;
      background: var(--gradient-accent);
      border: none;
      border-radius: var(--radius-md);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      animation: fadeInUp 0.5s ease-out 0.3s backwards;
      position: relative;
      overflow: hidden;
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px var(--color-accent-glow);
    }
    .btn-primary:hover:not(:disabled)::before {
      opacity: 1;
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .auth-footer {
      text-align: center;
      margin-top: 28px;
      animation: fadeInUp 0.5s ease-out 0.4s backwards;
    }

    .auth-footer p {
      color: var(--color-text-muted);
      font-size: 14px;
    }

    .auth-footer a {
      color: var(--color-accent-light);
      text-decoration: none;
      font-weight: 600;
      transition: color var(--transition-base);
    }
    .auth-footer a:hover {
      color: var(--color-accent);
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 36px 24px;
        border-radius: var(--radius-lg);
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
