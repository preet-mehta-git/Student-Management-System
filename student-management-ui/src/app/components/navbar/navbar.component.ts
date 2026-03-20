import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <a class="nav-brand" routerLink="/dashboard">
        <div class="brand-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
          </svg>
        </div>
        <span class="brand-text">StudentMS</span>
      </a>

      <div class="nav-links" [class.mobile-open]="mobileMenuOpen">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" (click)="mobileMenuOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Dashboard</span>
        </a>
        <a routerLink="/students" routerLinkActive="active" class="nav-link" (click)="mobileMenuOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>Students</span>
        </a>
        <a routerLink="/courses" routerLinkActive="active" class="nav-link" (click)="mobileMenuOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Courses</span>
        </a>
      </div>

      <div class="nav-right">
        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="mobileMenuOpen = !mobileMenuOpen" [class.open]="mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>

        <div class="user-info-wrapper">
          <div class="user-info" (click)="toggleDropdown($event)">
            <div class="user-avatar">{{ username.charAt(0).toUpperCase() }}</div>
            <div class="user-details">
              <span class="user-name">{{ username }}</span>
              <span class="user-role">{{ role }}</span>
            </div>
            <svg class="dropdown-chevron" [class.open]="showDropdown" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <div class="dropdown-menu" *ngIf="showDropdown" (click)="$event.stopPropagation()">
            <div class="dropdown-header">
              <div class="dd-avatar">{{ username.charAt(0).toUpperCase() }}</div>
              <div class="dd-info">
                <div class="dd-name">{{ username }}</div>
                <div class="dd-role">{{ role }} Account</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <a routerLink="/dashboard" class="dropdown-item" (click)="showDropdown = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </a>
            <a routerLink="/students" class="dropdown-item" (click)="showDropdown = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Students
            </a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout" (click)="logout()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-xl);
      height: var(--navbar-height);
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      transition: background var(--transition-base), box-shadow var(--transition-base);
    }
    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .brand-logo {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: var(--gradient-accent);
      display: flex; align-items: center; justify-content: center;
      color: white;
      box-shadow: 0 4px 12px var(--color-accent-glow);
      transition: transform var(--transition-base);
    }
    .nav-brand:hover .brand-logo { transform: scale(1.05); }
    .brand-text {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 700;
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 4px;
    }
    .nav-link {
      color: var(--color-text-muted);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }
    .nav-link:hover {
      color: var(--color-text-primary);
      background: rgba(0, 0, 0, 0.04);
    }
    .nav-link.active {
      color: var(--color-text-primary);
      background: rgba(99, 102, 241, 0.08);
    }
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 2px;
      background: var(--gradient-accent);
      border-radius: 1px;
    }
    .nav-link svg {
      opacity: 0.7;
      transition: opacity var(--transition-base);
    }
    .nav-link:hover svg, .nav-link.active svg { opacity: 1; }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Hamburger */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 36px; height: 36px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: var(--radius-sm);
      transition: background var(--transition-base);
    }
    .hamburger:hover { background: rgba(0,0,0,0.04); }
    .hamburger span {
      display: block;
      width: 100%; height: 2px;
      background: var(--color-text-secondary);
      border-radius: 1px;
      transition: all var(--transition-base);
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    .user-info-wrapper { position: relative; }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 12px 6px 6px;
      border-radius: var(--radius-md);
      transition: background var(--transition-base);
    }
    .user-info:hover { background: rgba(0, 0, 0, 0.04); }

    .user-avatar {
      width: 34px; height: 34px;
      border-radius: var(--radius-full);
      background: var(--gradient-accent);
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    .user-details { display: flex; flex-direction: column; }
    .user-name { color: var(--color-text-primary); font-size: 13px; font-weight: 600; }
    .user-role {
      color: var(--color-text-muted);
      font-size: 11px;
      font-weight: 500;
    }

    .dropdown-chevron {
      color: var(--color-text-faint);
      transition: transform var(--transition-base);
    }
    .dropdown-chevron.open { transform: rotate(180deg); }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 240px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--color-border-hover);
      border-radius: var(--radius-lg);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
      padding: 8px;
      animation: fadeInDown 0.25s ease-out;
      z-index: 1000;
    }

    .dropdown-header {
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .dd-avatar {
      width: 40px; height: 40px;
      border-radius: var(--radius-full);
      background: var(--gradient-accent);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 16px;
      box-shadow: 0 4px 12px var(--color-accent-glow);
    }
    .dd-name { color: var(--color-text-primary); font-weight: 600; font-size: 14px; }
    .dd-role { color: var(--color-text-muted); font-size: 12px; }

    .dropdown-divider {
      height: 1px;
      background: var(--color-border);
      margin: 4px 8px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: 14px;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      width: 100%;
      border: none;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font-family: var(--font-body);
    }
    .dropdown-item:hover {
      background: rgba(0, 0, 0, 0.04);
      color: var(--color-text-primary);
    }
    .dropdown-item.logout { color: var(--color-danger); }
    .dropdown-item.logout:hover { background: var(--color-danger-bg); }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .navbar { padding: 0 var(--space-md); }
      .hamburger { display: flex; }
      .user-details { display: none; }
      .dropdown-chevron { display: none; }

      .nav-links {
        position: fixed;
        top: var(--navbar-height);
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 16px;
        gap: 4px;
        border-bottom: 1px solid var(--color-border);
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
        transition: all var(--transition-base);
        z-index: 99;
      }
      .nav-links.mobile-open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }
      .nav-link { padding: 12px 16px; font-size: 15px; }
      .nav-link.active::after { display: none; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  username = '';
  role = '';
  showDropdown = false;
  mobileMenuOpen = false;
  isScrolled = false;

  constructor(private authService: AuthService, private eRef: ElementRef) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  logout() {
    this.showDropdown = false;
    this.authService.logout();
    window.location.href = '/login';
  }
}
