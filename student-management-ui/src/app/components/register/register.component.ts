import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
          </div>
          <h1>Create Account</h1>
          <p>Join the student management platform</p>
        </div>

        <form (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-group">
            <label for="reg-username">Username</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text" id="reg-username" [(ngModel)]="username" name="username"
                     placeholder="Choose a username" required autocomplete="username">
            </div>
          </div>

          <div class="form-group">
            <label for="reg-email">Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" id="reg-email" [(ngModel)]="email" name="email"
                     placeholder="Enter your email" required autocomplete="email">
            </div>
          </div>

          <div class="form-group">
            <label for="reg-password">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input [type]="showPassword ? 'text' : 'password'" id="reg-password"
                     [(ngModel)]="password" name="password"
                     placeholder="Create a password" required minlength="6"
                     (ngModelChange)="updatePasswordStrength()" autocomplete="new-password">
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword" tabindex="-1">
                <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <div class="password-strength" *ngIf="password.length > 0">
              <div class="strength-bar">
                <div class="strength-fill" [style.width.%]="passwordStrength" [class]="strengthClass"></div>
              </div>
              <span class="strength-label" [class]="strengthClass">{{ strengthLabel }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="reg-role">Role</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <select id="reg-role" [(ngModel)]="role" name="role">
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="error-msg" *ngIf="error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading" id="register-submit">
            <span class="btn-spinner" *ngIf="loading"></span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
    .orb-1 {
      width: 380px; height: 380px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0) 70%);
      top: -80px; right: -80px;
      animation: float 9s ease-in-out infinite;
    }
    .orb-2 {
      width: 320px; height: 320px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0) 70%);
      bottom: -60px; left: -60px;
      animation: float 11s ease-in-out infinite 3s;
    }
    .orb-3 {
      width: 220px; height: 220px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0) 70%);
      top: 40%; right: 20%;
      animation: float 13s ease-in-out infinite 5s;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: var(--radius-xl);
      padding: 44px 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.04);
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
    }

    .auth-header { text-align: center; margin-bottom: 32px; }

    .logo-wrapper { display: flex; justify-content: center; margin-bottom: 20px; }

    .logo-icon {
      width: 64px; height: 64px;
      border-radius: 18px;
      background: var(--gradient-accent);
      display: flex; align-items: center; justify-content: center;
      color: white;
      box-shadow: 0 8px 24px var(--color-accent-glow);
      animation: float 4s ease-in-out infinite;
    }

    .auth-header h1 {
      font-family: var(--font-display);
      color: var(--color-text-primary);
      font-size: 28px; font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }
    .auth-header p { color: var(--color-text-muted); font-size: 15px; margin: 0; }

    .form-group {
      margin-bottom: 20px;
      animation: fadeInUp 0.5s ease-out backwards;
    }
    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.15s; }
    .form-group:nth-child(3) { animation-delay: 0.2s; }
    .form-group:nth-child(4) { animation-delay: 0.25s; }

    .form-group label {
      display: block;
      color: var(--color-text-secondary);
      font-size: 13px; font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .input-wrapper { position: relative; display: flex; align-items: center; }

    .input-icon {
      position: absolute; left: 14px;
      color: var(--color-text-faint);
      transition: color var(--transition-base);
      pointer-events: none;
      flex-shrink: 0;
    }
    .input-wrapper:focus-within .input-icon { color: var(--color-accent); }

    .form-group input, .form-group select {
      width: 100%;
      padding: 14px 14px 14px 44px;
      background: var(--color-bg-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-size: 15px;
      font-family: var(--font-body);
      transition: all var(--transition-base);
      appearance: none;
    }
    .form-group select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(0,0,0,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }
    .form-group select option { background: #ffffff; color: #1e293b; }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--color-accent);
      background: var(--color-bg-input-focus);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
    .form-group input::placeholder { color: var(--color-text-faint); }

    .toggle-password {
      position: absolute; right: 14px;
      background: none; border: none;
      color: var(--color-text-faint);
      cursor: pointer; padding: 4px;
      display: flex; align-items: center;
      transition: color var(--transition-base);
    }
    .toggle-password:hover { color: var(--color-text-secondary); }

    /* Password Strength */
    .password-strength {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }
    .strength-bar {
      flex: 1;
      height: 4px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 2px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s;
    }
    .strength-fill.weak { background: #ef4444; }
    .strength-fill.medium { background: #f59e0b; }
    .strength-fill.strong { background: #10b981; }

    .strength-label {
      font-size: 12px;
      font-weight: 500;
      min-width: 56px;
    }
    .strength-label.weak { color: #ef4444; }
    .strength-label.medium { color: #f59e0b; }
    .strength-label.strong { color: #10b981; }

    .error-msg {
      display: flex; align-items: center; gap: 8px;
      color: var(--color-danger);
      font-size: 14px; margin-bottom: 20px;
      padding: 12px 16px;
      background: var(--color-danger-bg);
      border: 1px solid var(--color-danger-border);
      border-radius: var(--radius-md);
      animation: fadeInUp 0.3s ease-out;
    }

    .btn-primary {
      width: 100%; padding: 15px;
      background: var(--gradient-accent);
      border: none; border-radius: var(--radius-md);
      color: #fff; font-size: 15px; font-weight: 600;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex; align-items: center; justify-content: center; gap: 8px;
      animation: fadeInUp 0.5s ease-out 0.3s backwards;
      position: relative; overflow: hidden;
    }
    .btn-primary::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
      opacity: 0; transition: opacity var(--transition-base);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px var(--color-accent-glow);
    }
    .btn-primary:hover:not(:disabled)::before { opacity: 1; }
    .btn-primary:active:not(:disabled) { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

    .btn-spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .auth-footer {
      text-align: center; margin-top: 28px;
      animation: fadeInUp 0.5s ease-out 0.35s backwards;
    }
    .auth-footer p { color: var(--color-text-muted); font-size: 14px; }
    .auth-footer a {
      color: var(--color-accent-light);
      text-decoration: none; font-weight: 600;
      transition: color var(--transition-base);
    }
    .auth-footer a:hover { color: var(--color-accent); text-decoration: underline; }

    @media (max-width: 480px) {
      .auth-card { padding: 36px 24px; border-radius: var(--radius-lg); }
    }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = 'Admin';
  error = '';
  loading = false;
  showPassword = false;
  passwordStrength = 0;
  strengthLabel = '';
  strengthClass = '';

  constructor(private authService: AuthService, private router: Router) {}

  updatePasswordStrength() {
    let score = 0;
    if (this.password.length >= 6) score += 25;
    if (this.password.length >= 10) score += 15;
    if (/[A-Z]/.test(this.password)) score += 20;
    if (/[0-9]/.test(this.password)) score += 20;
    if (/[^A-Za-z0-9]/.test(this.password)) score += 20;

    this.passwordStrength = Math.min(score, 100);

    if (score <= 30) {
      this.strengthLabel = 'Weak';
      this.strengthClass = 'weak';
    } else if (score <= 65) {
      this.strengthLabel = 'Medium';
      this.strengthClass = 'medium';
    } else {
      this.strengthLabel = 'Strong';
      this.strengthClass = 'strong';
    }
  }

  onRegister() {
    this.loading = true;
    this.error = '';
    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
