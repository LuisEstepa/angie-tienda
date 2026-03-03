import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';  // ← .service (no solo auth)

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // ← AuthService NO va aquí
  template: `
    <nav class="navbar">
      <div class="nav-container">

        <a routerLink="/" class="logo">
          <span class="logo-icon">🛍️</span>
          <span class="logo-text">M&L Glow Shop</span>
        </a>

        <div class="search-bar">
          <input
            type="search"
            placeholder="¿Qué estás buscando?"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
          <button (click)="onSearch()">🔍</button>
        </div>

        <div class="nav-actions">
          <a routerLink="/productos" class="nav-link">Productos</a>

          <!-- Sin sesión -->
          <ng-container *ngIf="!auth.isLoggedIn()">
            <a routerLink="/login" class="nav-link">Ingresar</a>
            <a routerLink="/registro" class="btn-nav-register">Registrarse</a>
          </ng-container>

          <!-- Con sesión -->
          <ng-container *ngIf="auth.isLoggedIn()">
            <span class="user-greeting">Hola, {{ auth.currentUser()?.name }} 👋</span>
            <button class="btn-logout" (click)="auth.logout()">Salir</button>
          </ng-container>

          <a routerLink="/carrito" class="cart-btn">
            🛒
            <span class="badge" *ngIf="cartService.itemCount() > 0">
              {{ cartService.itemCount() }}
            </span>
          </a>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(15, 15, 19, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      padding: 0 2rem;
      height: 68px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-primary);
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .logo-icon { font-size: 1.6rem; }
    .search-bar {
      flex: 1;
      display: flex;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .search-bar:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(232,160,191,0.1);
    }
    .search-bar input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 0.6rem 1.2rem;
      color: var(--color-text);
      font-size: 0.9rem;
      outline: none;
    }
    .search-bar input::placeholder { color: var(--color-text-muted); }
    .search-bar button {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      border: none;
      padding: 0 1.2rem;
      color: #1a1a24;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .search-bar button:hover { opacity: 0.85; }
    .nav-actions { display: flex; align-items: center; gap: 1.5rem; }
    .nav-link {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-link:hover { color: var(--color-primary); }
    .btn-nav-register {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: #1a1a24;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.45rem 1.1rem;
      border-radius: 999px;
      transition: all 0.2s;
    }
    .btn-nav-register:hover { opacity: 0.85; transform: translateY(-1px); }
    .user-greeting {
      color: var(--color-text-soft);
      font-size: 0.88rem;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      font-size: 0.82rem;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-logout:hover { border-color: var(--color-danger); color: var(--color-danger); }
    .cart-btn {
      position: relative;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .cart-btn:hover { transform: scale(1.1); }
    .badge {
      position: absolute;
      top: -8px; right: -8px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: #1a1a24;
      border-radius: 50%;
      width: 20px; height: 20px;
      font-size: 0.65rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class NavbarComponent {
  searchQuery = '';

  constructor(
    public cartService: CartService,
    public auth: AuthService,        // ← público para usarlo en el template
    private router: Router
  ) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/productos'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }
}